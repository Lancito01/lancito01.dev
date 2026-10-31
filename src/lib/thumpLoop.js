import { useEffect, useState } from "react";
import { coverPalette } from "./useCoverColor";
import { presenceTone } from "./useSiteAccent";

// The made-up techno loop the Thump demos play along to, and the colours their lights take

export const BPM = 128;
export const BEAT_MS = 60_000 / BPM;
export const LIGHTS = 4;

// With nothing playing, the lights take the presence colour like the site's accent does (--green
// and --yellow in index.scss), except offline, where grey lights would look dead: a preset instead
const PRESENCE = { active: ["133 238 20"], idle: ["232 197 71"] };
const PRESET = ["255 46 99", "255 140 26", "120 60 255", "0 190 255"];
const SAMPLE_SIZE = 32;

// Like Thump, every light gets its own colour: a cover with fewer colours than lights gets close
// variations of the ones it has (redder, ambery, deeper, softer)
function spread(palette) {
    const shifts = [
        [0, 0, 0],
        [28, -10, -24],
        [-40, -40, -40],
        [40, 40, 40],
    ];
    return Array.from({ length: LIGHTS }, (_, i) => {
        if (i < palette.length) return palette[i];
        const base = palette[i % palette.length].split(" ").map(Number);
        const shift = shifts[Math.floor(i / palette.length) % shifts.length];
        return base.map((c, j) => Math.max(0, Math.min(255, c + shift[j]))).join(" ");
    });
}

// The main colours of an image, or null until (or unless) its pixels can be read
const useImagePalette = (src) => {
    const [palette, setPalette] = useState(null);

    useEffect(() => {
        setPalette(null);
        if (!src) return undefined;
        let cancelled = false;
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = src;
        image
            .decode()
            .then(() => {
                const canvas = document.createElement("canvas");
                canvas.width = SAMPLE_SIZE;
                canvas.height = SAMPLE_SIZE;
                const context = canvas.getContext("2d", { willReadFrequently: true });
                context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
                if (!cancelled) setPalette(coverPalette(context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data));
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [src]);

    return palette;
};

// One "r g b" per light: the colours of what I'm playing on Spotify, or my presence colour, or the preset
export const useThumpColours = (live) => {
    const cover = useImagePalette(live?.music?.image);
    return spread(cover ?? PRESENCE[presenceTone(live)] ?? PRESET);
};

// How loud each part of the loop is `ms` into it: a kick on every beat (dropping out for the last
// bar of every eight), a clap on beats 2 and 4, a rolling bassline between kicks, off-beat hats,
// a wobbly lead and a pad that slowly breathes over two bars
export function loopLevels(ms) {
    const beat = ms / BEAT_MS;
    const sinceBeat = (beat % 1) * BEAT_MS;
    const breakdown = Math.floor(beat / 4) % 8 === 7;
    const kick = breakdown ? 0 : Math.exp(-sinceBeat / 160);
    const clap = Math.floor(beat) % 2 === 1 ? Math.exp(-sinceBeat / 120) : 0;
    const sixteenth = (beat * 4) % 1;
    const rolling = breakdown ? 0.3 : 0.55 * Math.exp(-sixteenth * 2.5) * (Math.floor(beat * 4) % 4 === 0 ? 0 : 1);
    const hat = Math.exp(-Math.abs((beat % 1) - 0.5) * 14);
    const wobble = 0.5 + 0.25 * Math.sin(ms / 900) + 0.1 * Math.sin(ms / 170);
    const pad = 0.5 - 0.5 * Math.cos((beat / 8) * 2 * Math.PI);

    return {
        kick,
        clap,
        hat,
        pad,
        // sub, bass, lo-mid, mid, high, air
        bands: [
            Math.max(kick, rolling * 0.6),
            Math.max(kick * 0.9, rolling),
            0.35 + kick * 0.35 + rolling * 0.2 + clap * 0.2,
            wobble,
            0.25 + hat * 0.6 + clap * 0.15,
            0.08 + hat * 0.35,
        ],
    };
}
