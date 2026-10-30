import { useEffect, useState } from "react";

// Every request counts against Vercel's free monthly allowance (and going over pauses the API
// for 30 days), so check often only while there's something live to show
export const LIVE_POLL_MS = 10_000;
const IDLE_POLL_MS = 60_000;

const isLive = (data) => Boolean(data?.pc?.online || data?.music);

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

// What my PC and Spotify are up to, re-checked while the tab is visible: every 10 seconds
// while something's live, every minute otherwise. undefined until the first answer, null when
// the API isn't there. From coming back to the tab until the next regular check, the answer
// has `resumed: true`: whatever changed meanwhile did so unseen, so it should just show up.
const useLiveStats = () => {
    const [data, setData] = useState(undefined);

    useEffect(() => {
        let cancelled = false;
        let timer;

        let latest = null;
        const poll = async (resumed = false) => {
            clearTimeout(timer);
            try {
                latest = await fetchLiveStats();
                if (!cancelled) setData(latest && { ...latest, resumed });
            } catch {
                // keep showing the last answer; the next poll may work
                if (!cancelled) setData((current) => current ?? null);
            }
            if (!cancelled && document.visibilityState === "visible") {
                timer = setTimeout(poll, isLive(latest) ? LIVE_POLL_MS : IDLE_POLL_MS);
            }
        };
        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                // Anything left mid-move from before jumps to its end on the first frame back,
                // so the last answer counts as resumed too until the fresh one lands
                setData((current) => current && { ...current, resumed: true });
                poll(true);
            } else clearTimeout(timer);
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
