import { useEffect, useState } from "react";

const SAMPLE_SIZE = 16;

// The average colour of an image as "r g b", or null when there's no image or its host won't let
// the page read its pixels (Spotify's artwork CDN does). Keeps the last colour while a new one loads.
const useAverageColor = (src) => {
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

                const sum = [0, 0, 0];
                for (let i = 0; i < data.length; i += 4) {
                    sum[0] += data[i];
                    sum[1] += data[i + 1];
                    sum[2] += data[i + 2];
                }
                const pixels = data.length / 4;
                if (!cancelled) setColor(sum.map((channel) => Math.round(channel / pixels)).join(" "));
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

export default useAverageColor;
