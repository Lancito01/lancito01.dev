import { useEffect, useRef } from "react";
import useMediaQuery from "../../lib/useMediaQuery";
import { BEAT_MS } from "../../lib/thumpLoop";
import "./KickstepDemo.scss";

// What Kickstep would say about the loop the Thump demos play: the last ~4 s it hears, one lane per
// drum, each hit drawn as tall as the model is sure. Hits under the drum's threshold stay grey,
// the way a light stays dark when Kickstep isn't sure enough
const WINDOW_MS = 4100;
const DELAY_MS = 50;
const DRUMS = [
    { name: "kick", threshold: 0.5, low: 0.8 },
    { name: "clap / snare", threshold: 0.6, low: 0.45 },
    { name: "hats", threshold: 0.55, low: 0.4 },
];

// a steady made-up confidence per hit, so a hit doesn't change its mind while it scrolls by
const sureness = (beat, drum, low) => {
    const x = Math.sin(beat * 12.9898 + drum * 78.233) * 43758.5453;
    return low + (x - Math.floor(x)) * (0.99 - low);
};

// the same loop as thumpLoop's: a kick on every beat except in the last bar of every eight, a clap
// on beats 2 and 4, a hat on every off-beat
function hits(now) {
    const found = [];
    const first = Math.floor((now - WINDOW_MS) / BEAT_MS);
    for (let beat = first; beat * BEAT_MS <= now; beat++) {
        const at = beat * BEAT_MS;
        if (Math.floor(beat / 4) % 8 !== 7) found.push({ drum: 0, at });
        if (beat % 2 === 1) found.push({ drum: 1, at });
        found.push({ drum: 2, at: at + BEAT_MS / 2 });
    }
    return found
        .filter(({ at }) => at + DELAY_MS <= now && at >= now - WINDOW_MS)
        .map((hit) => ({ ...hit, sure: sureness(Math.round(hit.at / BEAT_MS * 2), hit.drum, DRUMS[hit.drum].low) }));
}

const KickstepDemo = () => {
    const canvasRef = useRef(null);
    const still = useMediaQuery("(prefers-reduced-motion: reduce)");

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        let width = 0;
        let height = 0;

        const resize = () => {
            const ratio = window.devicePixelRatio || 1;
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        const draw = (now) => {
            const style = getComputedStyle(canvas);
            const accent = style.getPropertyValue("--accent").trim();
            const rule = style.getPropertyValue("--rule").trim();
            const muted = style.getPropertyValue("--muted").trim();
            const lane = height / DRUMS.length;
            const bar = Math.max(3, width / 220);

            context.clearRect(0, 0, width, height);
            DRUMS.forEach((drum, i) => {
                const bottom = (i + 1) * lane - 6;
                const tall = lane - 12;
                context.fillStyle = rule;
                context.fillRect(0, bottom, width, 1);
                // the threshold, as a faint dashed line across the lane
                context.strokeStyle = muted;
                context.globalAlpha = 0.4;
                context.setLineDash([3, 4]);
                context.beginPath();
                context.moveTo(0, Math.round(bottom - drum.threshold * tall) + 0.5);
                context.lineTo(width, Math.round(bottom - drum.threshold * tall) + 0.5);
                context.stroke();
                context.globalAlpha = 1;
            });
            context.setLineDash([]);

            hits(now).forEach(({ drum, at, sure }) => {
                const x = width - ((now - at) / WINDOW_MS) * width;
                const bottom = (drum + 1) * lane - 6;
                const tall = (lane - 12) * sure;
                const over = sure >= DRUMS[drum].threshold;
                // fresh hits glow a little, then settle
                const age = (now - at) / 400;
                context.globalAlpha = over ? 0.55 + 0.45 * Math.exp(-age) : 0.6;
                context.fillStyle = over ? accent : muted;
                context.fillRect(x - bar / 2, bottom - tall, bar, tall);
            });
            context.globalAlpha = 1;
        };

        resize();
        const observer = new ResizeObserver(() => {
            resize();
            if (still) draw(BEAT_MS * 37.3);
        });
        observer.observe(canvas);

        if (still) {
            draw(BEAT_MS * 37.3);
            return () => observer.disconnect();
        }

        let frame;
        const tick = (now) => {
            frame = requestAnimationFrame(tick);
            draw(now);
        };
        frame = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [still]);

    return (
        <div className="kickstep-demo" aria-hidden="true">
            <div className="kickstep-demo__lanes mono">
                {DRUMS.map((drum) => (
                    <span key={drum.name}>{drum.name}</span>
                ))}
            </div>
            <canvas ref={canvasRef} className="kickstep-demo__canvas" />
            <div className="kickstep-demo__axis mono">
                <span>4 s ago</span>
                <span>now</span>
            </div>
        </div>
    );
};

export default KickstepDemo;
