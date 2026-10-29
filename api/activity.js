import { GITHUB_USER, summarizeEvents } from "../src/lib/github.js";

// Vercel function behind the "currently" status and the activity feed.
// With a GITHUB_TOKEN for this account, GitHub also returns private events;
// summarizeEvents strips their repo names and details before they leave here.
export default async function handler(req, res) {
    const token = process.env.GITHUB_TOKEN;
    const url = `https://api.github.com/users/${GITHUB_USER}/events${token ? "" : "/public"}?per_page=50`;

    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/vnd.github+json",
                "User-Agent": "lancito01.dev",
                "X-GitHub-Api-Version": "2022-11-28",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);

        res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
        res.status(200).json(summarizeEvents(await response.json()));
    } catch (error) {
        console.error(error);
        res.setHeader("Cache-Control", "public, s-maxage=30");
        res.status(502).json({ error: "Couldn't reach GitHub" });
    }
}
