import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { GITHUB_USER } from "../../lib/github";
import { timeAgo } from "../../lib/time";
import { activityItemShape, activityStatus } from "../../lib/useActivity";
import "./ActivityFeed.scss";

const glyphs = {
    IssueCommentEvent: [">", "comment"],
    PullRequestReviewEvent: [">", "comment"],
    PullRequestReviewCommentEvent: [">", "comment"],
    ReleaseEvent: ["^", "release"],
    PullRequestEvent: ["+", "pr"],
    IssuesEvent: ["!", "issue"],
    PushEvent: ["*", "push"],
};

const ActivityRow = ({ item, now, index }) => {
    const [glyph, kind] = glyphs[item.type] ?? ["~", "other"];
    const body = (
        <>
            <span className={`activity__glyph mono activity__glyph--${kind}`}>{glyph}</span>
            <span className="activity__text">
                {item.past}
                <small title={item.detail ?? undefined}>
                    <span className="mono">{item.repo ?? "private repo"}</span>
                    {item.detail && <> · {item.detail}</>}
                </small>
            </span>
            <time className="activity__time mono" dateTime={item.at}>
                {timeAgo(item.at, now)}
            </time>
        </>
    );

    return (
        <motion.li
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + index * 0.06, duration: 0.35, ease: "easeOut" }}
        >
            {item.url ? (
                <a className="activity__row" href={item.url} target="_blank" rel="noreferrer">
                    {body}
                </a>
            ) : (
                <div className="activity__row">{body}</div>
            )}
        </motion.li>
    );
};

ActivityRow.propTypes = {
    item: activityItemShape.isRequired,
    now: PropTypes.instanceOf(Date).isRequired,
    index: PropTypes.number.isRequired,
};

// The list scrolls inside the panel; a fade shows at whichever end has more to see
const ScrollingList = ({ items, now }) => {
    const listRef = useRef(null);
    const [edges, setEdges] = useState({ top: false, bottom: false });

    const updateEdges = useCallback(() => {
        const list = listRef.current;
        if (!list) return;
        const top = list.scrollTop > 2;
        const bottom = list.scrollTop + list.clientHeight < list.scrollHeight - 2;
        setEdges((current) => (current.top === top && current.bottom === bottom ? current : { top, bottom }));
    }, []);

    useEffect(() => {
        updateEdges();
        // The panel's height follows the intro beside it, so re-check when it resizes
        const observer = new ResizeObserver(updateEdges);
        observer.observe(listRef.current);
        return () => observer.disconnect();
    }, [updateEdges, items]);

    return (
        <div
            className={`activity__scroll${edges.top ? " activity__scroll--fade-top" : ""}${
                edges.bottom ? " activity__scroll--fade-bottom" : ""
            }`}
        >
            <ul className="activity__list" ref={listRef} onScroll={updateEdges}>
                {items.map((item, index) => (
                    <ActivityRow key={item.id} item={item} now={now} index={index} />
                ))}
                <li className="activity__more">
                    that&apos;s the latest.{" "}
                    <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
                        more on my github
                    </a>
                </li>
            </ul>
        </div>
    );
};

ScrollingList.propTypes = {
    items: PropTypes.arrayOf(activityItemShape).isRequired,
    now: PropTypes.instanceOf(Date).isRequired,
};

const ActivityFeed = ({ status, items, now }) => {
    return (
        <aside className="activity" aria-label="Recent GitHub activity">
            <div className="activity__head">
                <h2>recent activity</h2>
                <a className="mono" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
                    github.com/{GITHUB_USER}
                </a>
            </div>

            {status === "loading" && (
                <ul className="activity__list" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                        <li key={i} className="activity__row activity__row--skeleton">
                            <span />
                            <span />
                        </li>
                    ))}
                </ul>
            )}

            {status === "error" && (
                <p className="activity__empty">
                    couldn&apos;t reach github right now. try{" "}
                    <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">
                        my profile
                    </a>{" "}
                    instead.
                </p>
            )}

            {status === "ready" && items.length === 0 && (
                <p className="activity__empty">nothing public in the last few weeks.</p>
            )}

            {status === "ready" && items.length > 0 && <ScrollingList items={items} now={now} />}
        </aside>
    );
};

ActivityFeed.propTypes = {
    status: activityStatus.isRequired,
    items: PropTypes.arrayOf(activityItemShape).isRequired,
    now: PropTypes.instanceOf(Date).isRequired,
};

export default ActivityFeed;
