import { useEffect, useState } from "react";
import "./DeltaOverlay.scss";

const SAMPLES = 48;
const CORES = 12;

const jitter = (base, spread) => base + (Math.random() - 0.5) * spread;

// a frame time around 6.9 ms (144 fps), with the odd spike like a real game
const nextFrame = () => (Math.random() < 0.06 ? jitter(11, 5) : jitter(6.9, 0.8));

const initialFrames = () => Array.from({ length: SAMPLES }, nextFrame);
const initialCores = () => Array.from({ length: CORES }, () => Math.random());

// A copy of Delta's "minimal" theme, ticking along with made-up numbers
const DeltaOverlay = () => {
    const [frames, setFrames] = useState(initialFrames);
    const [cores, setCores] = useState(initialCores);
    const [gpu, setGpu] = useState(97);

    useEffect(() => {
        const id = setInterval(() => {
            setFrames((current) => [...current.slice(1), nextFrame()]);
        }, 120);
        const slow = setInterval(() => {
            setCores((current) => current.map((load) => Math.min(1, Math.max(0.08, load + (Math.random() - 0.5) * 0.5))));
            setGpu(Math.round(jitter(96, 5)));
        }, 900);
        return () => {
            clearInterval(id);
            clearInterval(slow);
        };
    }, []);

    const recent = frames.slice(-10);
    const avg = recent.reduce((sum, ms) => sum + ms, 0) / recent.length;
    const low = Math.round(1000 / Math.max(...frames));
    const max = 18;
    const points = frames.map((ms, i) => `${(i / (SAMPLES - 1)) * 100},${30 - (ms / max) * 30}`).join(" ");

    return (
        <div className="delta-overlay mono" aria-hidden="true">
            <span className="delta-overlay__label delta-overlay__label--fps">FPS</span>
            <span>
                <b className="delta-overlay__big">{Math.round(1000 / avg)}</b>
                <small>FPS</small> <b>{avg.toFixed(1)}</b>
                <small>ms</small> <b>{low}</b>
                <small>1%</small>
            </span>
            <svg className="delta-overlay__graph" viewBox="0 0 100 30" preserveAspectRatio="none">
                <polyline points={points} />
            </svg>

            <span className="delta-overlay__label delta-overlay__label--gpu">GPU</span>
            <span>
                <b>{gpu}</b>
                <small>%</small> <b>68</b>
                <small>°C</small> <b>241</b>
                <small>W</small>
            </span>

            <span className="delta-overlay__label delta-overlay__label--cpu">CPU</span>
            <span className="delta-overlay__cores">
                {cores.map((load, i) => (
                    <i key={i} style={{ height: `${Math.round(load * 100)}%` }} />
                ))}
            </span>

            <span className="delta-overlay__label delta-overlay__label--ram">RAM</span>
            <span>
                <b>17.6</b>
                <small>GB</small> <b>55</b>
                <small>%</small>
            </span>
        </div>
    );
};

export default DeltaOverlay;
