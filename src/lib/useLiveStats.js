import { useEffect, useState } from "react";

const POLL_MS = 20_000;

async function fetchLiveStats() {
    // `vite dev` has no /api, so `?demo` (dev only) fills the strip with sample data instead
    if (import.meta.env.DEV) {
        const demo = new URLSearchParams(window.location.search).get("demo");
        if (demo !== null) return (await import("./liveStatsDemo.js")).default(demo);
    }
    const response = await fetch("/api/pc-stats");
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) return null;
    return response.json();
}

// What my PC and Spotify are up to, re-checked every 20 seconds while the tab is visible.
// null until the first answer, or when the API isn't there.
const useLiveStats = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        let cancelled = false;
        let timer;

        const poll = async () => {
            clearTimeout(timer);
            try {
                const next = await fetchLiveStats();
                if (!cancelled) setData(next);
            } catch {
                // keep showing the last answer; the next poll may work
            }
            if (!cancelled && document.visibilityState === "visible") timer = setTimeout(poll, POLL_MS);
        };
        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") poll();
            else clearTimeout(timer);
        };

        poll();
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => {
            cancelled = true;
            clearTimeout(timer);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, []);

    return data;
};

export default useLiveStats;
