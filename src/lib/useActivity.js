import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GITHUB_USER, summarizeEvents } from "./github.js";

export const activityItemShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    at: PropTypes.string.isRequired,
    private: PropTypes.bool,
    repo: PropTypes.string,
    past: PropTypes.string.isRequired,
    present: PropTypes.string.isRequired,
    detail: PropTypes.string,
    url: PropTypes.string,
});

export const activityStatus = PropTypes.oneOf(["loading", "ready", "error"]);

async function fetchActivity() {
    try {
        const response = await fetch("/api/activity");
        if (response.headers.get("content-type")?.includes("application/json")) {
            if (response.ok) return await response.json();
        }
    } catch {
        // fall through to the public API
    }

    // /api only exists on Vercel, so `vite dev` reads public events straight from GitHub
    const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=50`);
    if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);
    return summarizeEvents(await response.json());
}

// One request per page load, shared by every component that needs it
let request;

const useActivity = () => {
    const [state, setState] = useState({ status: "loading", items: [], current: null });

    useEffect(() => {
        let cancelled = false;
        request ??= fetchActivity();
        request
            .then((data) => !cancelled && setState({ status: "ready", ...data }))
            .catch(() => {
                request = undefined;
                if (!cancelled) setState({ status: "error", items: [], current: null });
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return state;
};

export default useActivity;
