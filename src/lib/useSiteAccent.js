import { useEffect } from "react";
import useCoverColor, { readableAccent } from "./useCoverColor";

// Whether I'm at the PC, as the presence dot shows it: active (green), idle (yellow) or off (grey)
export function presenceTone(live) {
    if (live?.pc?.online) return live.pc.status === "away" ? "idle" : "active";
    if (live?.music) return "idle";
    return "off";
}

// Sets the page's accent (the ">" in headings and so on) on every page. A page can pin its own
// colour with `override`; otherwise it flows through the colours of what's playing on Spotify
// (see useCoverColor), and with nothing playing, takes the presence colour (see index.scss).
const useSiteAccent = (live, override) => {
    useCoverColor(override ? null : live?.music?.image, (colour) => {
        const root = document.documentElement;
        if (colour) {
            root.style.setProperty("--accent", `rgb(${readableAccent(colour)})`);
            root.dataset.cover = "";
        } else {
            root.style.removeProperty("--accent");
            delete root.dataset.cover;
        }
    });

    useEffect(() => {
        if (!override) return undefined;
        const root = document.documentElement;
        root.style.setProperty("--accent", override);
        return () => root.style.removeProperty("--accent");
    }, [override]);

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
