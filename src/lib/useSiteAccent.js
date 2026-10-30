import { useEffect } from "react";
import useAverageColor, { readableAccent } from "./useAverageColor";

// Whether I'm at the PC, as the presence dot shows it: active (green), idle (yellow) or off (grey)
export function presenceTone(live) {
    if (live?.pc?.online) return live.pc.status === "away" ? "idle" : "active";
    if (live?.music) return "idle";
    return "off";
}

// Sets the page's accent (the ">" in headings and so on) on every page. A page can pin its own
// colour with `override`; otherwise it takes the colour of what's playing on Spotify, and with
// nothing playing, the presence colour (see index.scss).
const useSiteAccent = (live, override) => {
    const tint = useAverageColor(live?.music?.image);
    const song = live?.music && tint ? `rgb(${readableAccent(tint)})` : null;
    const accent = override ?? song;

    useEffect(() => {
        if (!accent) return undefined;
        const root = document.documentElement;
        root.style.setProperty("--accent", accent);
        return () => root.style.removeProperty("--accent");
    }, [accent]);

    // Grey until the first answer (index.html starts it that way) so it fades in to the real colour.
    // After that, only once the PC has actually reported, so a guess from the clock never greys it out.
    const tone = live === undefined ? "off" : live?.pc ? presenceTone(live) : null;
    useEffect(() => {
        const root = document.documentElement;
        if (tone) root.dataset.presence = tone;
        else delete root.dataset.presence;
    }, [tone]);
};

export default useSiteAccent;
