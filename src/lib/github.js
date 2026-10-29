// Turns raw GitHub events into short lines for the activity feed and the
// "currently" status, where `present` is followed by the repo name.
// Shared by the /api/activity function and the client-side fallback,
// so private events are redacted in one place.

export const GITHUB_USER = "lancito01";

const PRIVATE = {
    past: "worked on something private",
    present: "working on something private",
};

const repoName = (fullName) => fullName.split("/")[1] ?? fullName;

const times = (count) => (count > 1 ? ` ${count} times` : "");

const truncate = (text, max = 90) => (text && text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

function describe(event, count) {
    const { type, payload = {} } = event;
    const repo = event.repo?.name ?? "";
    const repoUrl = `https://github.com/${repo}`;

    switch (type) {
        case "PushEvent": {
            const branch = payload.ref?.replace("refs/heads/", "") ?? "a branch";
            return {
                past: `pushed${times(count)} to ${branch}`,
                present: "pushing code to",
                url: repoUrl,
            };
        }
        case "CreateEvent":
            if (payload.ref_type === "repository") {
                return { past: "created a new repo", present: "starting a new repo,", url: repoUrl };
            }
            return {
                past: `created ${payload.ref_type} ${payload.ref}`,
                present: "branching out in",
                url: repoUrl,
            };
        case "DeleteEvent":
            return {
                past: `deleted ${payload.ref_type} ${payload.ref}`,
                present: "cleaning up",
                url: repoUrl,
            };
        case "ReleaseEvent": {
            const tag = payload.release?.tag_name ?? "";
            return {
                past: `released ${repoName(repo)} ${tag}`,
                present: `shipping ${tag} of`,
                url: payload.release?.html_url ?? repoUrl,
            };
        }
        case "PullRequestEvent": {
            const number = payload.number ?? payload.pull_request?.number;
            const merged = payload.action === "merged" || payload.pull_request?.merged;
            const action = merged ? "merged" : payload.action;
            return {
                past: merged ? `got #${number} merged` : `${action} pull request #${number}`,
                present: merged ? "getting a pull request merged in" : "opening a pull request in",
                detail: payload.pull_request?.title,
                url: `${repoUrl}/pull/${number}`,
            };
        }
        case "PullRequestReviewEvent":
        case "PullRequestReviewCommentEvent": {
            const number = payload.pull_request?.number;
            return {
                past: `reviewed pull request #${number}`,
                present: "reviewing a pull request in",
                detail: payload.pull_request?.title,
                url: `${repoUrl}/pull/${number}`,
            };
        }
        case "IssuesEvent": {
            const issue = payload.issue ?? {};
            return {
                past: `${payload.action} issue #${issue.number}`,
                present: `${payload.action === "closed" ? "closing" : "opening"} an issue in`,
                detail: issue.title,
                url: issue.html_url ?? repoUrl,
            };
        }
        case "IssueCommentEvent": {
            const issue = payload.issue ?? {};
            const kind = issue.pull_request ? "pull request" : "issue";
            return {
                past: `commented${times(count)} on ${kind} #${issue.number}`,
                present: `discussing ${kind === "issue" ? "an issue" : "a pull request"} in`,
                detail: issue.title,
                url: payload.comment?.html_url ?? issue.html_url ?? repoUrl,
            };
        }
        case "WatchEvent":
            return { past: "starred it", present: "checking out", url: repoUrl };
        case "ForkEvent":
            return { past: "forked it", present: "forking", url: payload.forkee?.html_url ?? repoUrl };
        case "PublicEvent":
            return { past: "made it public", present: "open-sourcing", url: repoUrl };
        default:
            return { past: "was active here", present: "working on", url: repoUrl };
    }
}

// Consecutive events of the same kind on the same thing collapse into one line,
// and consecutive private events collapse whatever they were
const groupKey = (event) =>
    event.public === false
        ? "private"
        : [
              event.type,
              event.repo?.name,
              event.payload?.issue?.number ?? event.payload?.number ?? event.payload?.ref ?? "",
          ].join("|");

export function summarizeEvents(events, limit = 6) {
    const sorted = [...events].sort((a, b) => b.created_at.localeCompare(a.created_at));
    const groups = [];

    for (const event of sorted) {
        const last = groups[groups.length - 1];
        if (last && groupKey(last.event) === groupKey(event)) {
            last.count++;
            continue;
        }
        if (groups.length === limit) break;
        groups.push({ event, count: 1 });
    }

    const items = groups.map(({ event, count }) => {
        const isPrivate = event.public === false;
        const text = isPrivate ? PRIVATE : describe(event, count);
        return {
            id: event.id,
            type: event.type,
            at: event.created_at,
            private: isPrivate,
            repo: isPrivate ? null : event.repo?.name,
            past: text.past,
            present: text.present,
            detail: isPrivate ? null : truncate(text.detail) ?? null,
            url: isPrivate ? null : text.url ?? null,
        };
    });

    return { items, current: items[0] ?? null };
}
