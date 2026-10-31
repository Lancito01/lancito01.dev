import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { BEAT_MS, LIGHTS, loopLevels, useThumpColours } from "../../lib/thumpLoop";
import useMediaQuery from "../../lib/useMediaQuery";
import "./ThumpLights.scss";

// Just the lights from Thump's panel (see ThumpDemo): the first on the kick, the rest on the bass,
// passing their colours along on every kick
const ThumpLights = ({ live }) => {
    const root = useRef(null);
    const still = useMediaQuery("(prefers-reduced-motion: reduce)");
    const colours = useThumpColours(live);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (still) return undefined;
        const lights = root.current.children;
        let frame;
        let lastBeat = -1;
        const tick = (now) => {
            frame = requestAnimationFrame(tick);
            const { kick, bands } = loopLevels(now);
            [...lights].forEach((light, i) => {
                const level = i === 0 ? 0.25 + kick * 0.75 : 0.45 + bands[1] * 0.55;
                light.style.setProperty("--level", level.toFixed(3));
            });
            const beat = Math.floor(now / BEAT_MS);
            if (beat !== lastBeat && kick > 0.5) setStep((s) => s + 1);
            lastBeat = beat;
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [still]);

    return (
        <span className="thump-lights" ref={root} aria-hidden="true">
            {colours.map((_, i) => (
                <i key={i} style={{ "--colour": colours[(i + (still ? 0 : step)) % LIGHTS] }} />
            ))}
        </span>
    );
};

ThumpLights.propTypes = {
    // what my PC and Spotify are up to, from useLiveStats
    live: PropTypes.object,
};

export default ThumpLights;
