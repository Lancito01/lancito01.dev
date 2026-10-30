import { useEffect, useRef, useState } from "react";
import useMediaQuery from "./useMediaQuery";

const SAMPLE_SIZE = 32;
const HUE_BUCKETS = 24;
const MAX_COLOURS = 4;
// how long the colour takes to blend from one of a cover's colours to the next
const BLEND_MS = 6_000;
// how long a new song's colours take to fade in from the last song's
const SONG_FADE_MS = 2_500;
const FRAME_MS = 50;

// The plain mean of some RGBA pixels, as "r g b"
export function averageColor(data) {
    const sum = [0, 0, 0];
    for (let i = 0; i < data.length; i += 4) {
        sum[0] += data[i];
        sum[1] += data[i + 1];
        sum[2] += data[i + 2];
    }
    const pixels = data.length / 4;
    return sum.map((channel) => Math.round(channel / pixels)).join(" ");
}

// The cover's main colours, each "r g b", the one covering the most of it first. Averaging every
// pixel turns a colourful cover to mud (red on black comes out maroon), so the pixels that are
// clearly a colour (not grey, black or white) are sorted into hue buckets instead. A bucket's area
// counts half of its neighbours too, so a colour on a bucket edge isn't split in two. The biggest
// buckets win, as long as they're at least 45° of hue apart and big enough to notice, and each one's
// pixels are averaged weighted by how strong they are, so the shadows in a colour don't dull it.
// A cover with almost no colour in it gets just its plain mean.
export function coverPalette(data) {
    const buckets = Array.from({ length: HUE_BUCKETS }, () => ({ count: 0, weight: 0, r: 0, g: 0, b: 0 }));
    let colourful = 0;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        const max = Math.max(r, g, b);
        const chroma = (max - Math.min(r, g, b)) / 255;
        if (chroma < 0.15) continue;

        let hue;
        if (max === r) hue = ((g - b) / 255 / chroma + 6) % 6;
        else if (max === g) hue = (b - r) / 255 / chroma + 2;
        else hue = (r - g) / 255 / chroma + 4;

        const bucket = buckets[Math.floor((hue / 6) * HUE_BUCKETS) % HUE_BUCKETS];
        bucket.count += 1;
        bucket.weight += chroma;
        bucket.r += r * chroma;
        bucket.g += g * chroma;
        bucket.b += b * chroma;
        colourful += 1;
    }

    // a cover under 5% colour reads as a grey one
    const pixels = data.length / 4;
    if (colourful < pixels * 0.05) return [averageColor(data)];

    const area = (i) =>
        buckets[i].count +
        (buckets[(i + HUE_BUCKETS - 1) % HUE_BUCKETS].count + buckets[(i + 1) % HUE_BUCKETS].count) / 2;
    const bySize = buckets.map((_, i) => i).sort((a, b) => area(b) - area(a));
    const minArea = Math.max(pixels * 0.015, area(bySize[0]) * 0.05);
    const apart = (a, b) => Math.min(Math.abs(a - b), HUE_BUCKETS - Math.abs(a - b)) >= HUE_BUCKETS / 8;

    const picked = [];
    for (const i of bySize) {
        if (picked.length === MAX_COLOURS || area(i) < minArea) break;
        if (buckets[i].count && picked.every((j) => apart(i, j))) picked.push(i);
    }

    return picked.map((i) => {
        const { weight, r, g, b } = buckets[i];
        return [r, g, b].map((channel) => Math.round(channel / weight)).join(" ");
    });
}

// sRGB "r g b" to and from OKLab, where a straight line between two colours looks like an even
// blend of just those two (red to green goes through a muted olive, not orange and yellow)
function toOklab(color) {
    const [r, g, b] = color.split(" ").map((channel) => {
        const c = channel / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    ];
}

function fromOklab([L, A, B]) {
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
    const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
    const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ]
        .map((c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055))
        .map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255))
        .join(" ");
}

function mix(from, to, t) {
    const [a, b] = [toOklab(from), toOklab(to)];
    return fromOklab(a.map((channel, i) => channel + (b[i] - channel) * t));
}

// The colour loop every useCoverColor on the page follows, so the accent and the music strip's
// tint move together: the song's palette, when it started, and what showed before it to blend from
let loop = { src: null, palette: null, start: 0, from: null };
let shown = null;

function loopColour(now, still) {
    const { palette, start, from } = loop;
    const elapsed = now - start;
    let colour = palette[0];
    if (palette.length > 1 && !still) {
        const t = elapsed / BLEND_MS;
        const i = Math.floor(t) % palette.length;
        colour = mix(palette[i], palette[(i + 1) % palette.length], t % 1);
    }
    if (from && !still && elapsed < SONG_FADE_MS) colour = mix(from, colour, elapsed / SONG_FADE_MS);
    shown = colour;
    return colour;
}

// Keeps an image's colour flowing into `onColour` ("r g b", or null when there's no image or its
// host won't let the page read its pixels; Spotify's artwork CDN does): its main colours (see
// coverPalette), blending from one straight into the next and on round, never holding still. A
// new image's colours fade in from what was showing, and until they load, the last ones carry on.
// With reduced motion it stays on the biggest colour.
const useCoverColor = (src, onColour) => {
    const [loaded, setLoaded] = useState(null);
    const [failed, setFailed] = useState(null);
    const still = useMediaQuery("(prefers-reduced-motion: reduce)");
    const onColourRef = useRef(onColour);
    onColourRef.current = onColour;

    useEffect(() => {
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
                const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
                if (cancelled) return;
                if (loop.src !== src) loop = { src, palette: coverPalette(data), start: Date.now(), from: shown };
                setLoaded(src);
            })
            .catch(() => {
                if (!cancelled) setFailed(src);
            });

        return () => {
            cancelled = true;
        };
    }, [src]);

    useEffect(() => {
        if (!src || failed === src || !loop.palette) {
            // the next song has nothing showing to fade in from
            if (!src) shown = null;
            onColourRef.current(null);
            return undefined;
        }

        // the colour moves slowly, so a few steps a second are plenty
        let frame;
        let last = 0;
        let applied = null;
        const tick = (now) => {
            frame = requestAnimationFrame(tick);
            if (now - last < FRAME_MS) return;
            last = now;
            const colour = loopColour(Date.now(), still);
            if (colour !== applied) onColourRef.current(colour);
            applied = colour;
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [src, loaded, failed, still]);
};

// The same hue lifted to a lightness that reads on the dark page, as "r g b". Dark covers average
// out close to black, which would make an invisible accent.
export function readableAccent(color, minLightness = 0.6) {
    const [r, g, b] = color.split(" ").map((channel) => channel / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lightness = (max + min) / 2;
    if (lightness >= minLightness) return color;

    const chroma = max - min;
    const saturation = chroma === 0 ? 0 : chroma / (1 - Math.abs(2 * lightness - 1));
    let hue = 0;
    if (chroma) {
        if (max === r) hue = ((g - b) / chroma + 6) % 6;
        else if (max === g) hue = (b - r) / chroma + 2;
        else hue = (r - g) / chroma + 4;
    }

    // back from HSL with the new lightness
    const c = (1 - Math.abs(2 * minLightness - 1)) * saturation;
    const x = c * (1 - Math.abs((hue % 2) - 1));
    const m = minLightness - c / 2;
    const [r1, g1, b1] = [
        [c, x, 0],
        [x, c, 0],
        [0, c, x],
        [0, x, c],
        [x, 0, c],
        [c, 0, x],
    ][Math.floor(hue) % 6];
    return [r1, g1, b1].map((channel) => Math.round((channel + m) * 255)).join(" ");
}

export default useCoverColor;
