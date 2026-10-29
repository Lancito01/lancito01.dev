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

export default useAverageColor;
