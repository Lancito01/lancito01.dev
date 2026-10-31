import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { loopLevels } from "../../lib/thumpLoop";
import useMediaQuery from "../../lib/useMediaQuery";
import "./BeatGlows.scss";

// Each glow is one part of the loop, lit in one of the lights' colours, at how bright it gets at most
const GLOWS = [
    { part: "kick", peak: 0.32 },
    { part: "clap", peak: 0.22 },
    { part: "hat", peak: 0.12 },
    { part: "pad", peak: 0.2 },
];

// Soft glows behind the Thump page that play along to the same loop as the demo panel: the kick
// bottom left, the clap top right, the hats on the right and a pad slowly breathing up top.
// In <body> so the page's fade-in transform doesn't pin them to the page instead of the window.
const BeatGlows = ({ colours }) => {
    const root = useRef(null);
    const still = useMediaQuery("(prefers-reduced-motion: reduce)");

    useEffect(() => {
        const glows = root.current.children;
        const show = (levels) =>
            GLOWS.forEach(({ part, peak }, i) => {
                glows[i].style.opacity = (levels[part] * peak).toFixed(3);
            });

        if (still) {
            show({ kick: 0.5, clap: 0.5, hat: 0.5, pad: 0.5 });
            return undefined;
        }

        let frame;
        const tick = (now) => {
            frame = requestAnimationFrame(tick);
            show(loopLevels(now));
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [still]);

    return createPortal(
        <div className="beat-glows" ref={root} aria-hidden="true">
            {GLOWS.map(({ part }, i) => (
                <i key={part} className={`beat-glows__glow beat-glows__glow--${part}`} style={{ "--colour": colours[i] }} />
            ))}
        </div>,
        document.body,
    );
};

BeatGlows.propTypes = {
    // one "r g b" per glow, the same as the demo's lights
    colours: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BeatGlows;
