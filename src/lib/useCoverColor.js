import { useEffect, useState } from "react";

const SAMPLE_SIZE = 32;
const HUE_BUCKETS = 24;

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

// The colour most of the cover is, as "r g b". Averaging every pixel turns a colourful cover to mud
// (red on black comes out maroon), so the pixels that are clearly a colour (not grey, black or
// white) are sorted into hue buckets instead. The bucket covering the most of the cover, with half
// of its neighbours so a colour on a bucket edge isn't split in two, wins. Its pixels are then
// averaged weighted by how strong each one is, so the shadows in that colour don't dull it. A cover
// with almost no colour in it gets its plain mean.
export function dominantColor(data) {
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
    if (colourful < (data.length / 4) * 0.05) return averageColor(data);

    const area = (i) =>
        buckets[i].count +
        (buckets[(i + HUE_BUCKETS - 1) % HUE_BUCKETS].count + buckets[(i + 1) % HUE_BUCKETS].count) / 2;
    let best = 0;
    for (let i = 1; i < HUE_BUCKETS; i++) if (area(i) > area(best)) best = i;

    const { weight, r, g, b } = buckets[best];
    return [r, g, b].map((channel) => Math.round(channel / weight)).join(" ");
}

// The main colour of an image (see dominantColor), or null when there's no image or its host
// won't let the page read its pixels (Spotify's artwork CDN does). Keeps the last colour while a
// new one loads.
const useCoverColor = (src) => {
    const [color, setColor] = useState(null);

    useEffect(() => {
        if (!src) {
            setColor(null);
            return undefined;
        }

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
                if (!cancelled) setColor(dominantColor(data));
            })
            .catch(() => {
                if (!cancelled) setColor(null);
            });

        return () => {
            cancelled = true;
        };
    }, [src]);

    return color;
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
