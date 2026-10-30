import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useMediaQuery from "../../lib/useMediaQuery";
import "./Marquee.scss";

const SPEED = 40; // px per second while it's sliding
const HOLD = 0.2; // share of each pass spent resting at either end, see the keyframes

// One line of text that slides back and forth when it's too long to fit, so the whole of it can be
// read; with reduced motion it stays put and ends in an ellipsis instead
const Marquee = ({ as: Tag = "span", className, children }) => {
    const ref = useRef(null);
    const textRef = useRef(null);
    const still = useMediaQuery("(prefers-reduced-motion: reduce)");
    const [shift, setShift] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (still) {
            setShift(0);
            return;
        }
        // offsetWidth rather than scrollWidth, which the slide itself would throw off
        const measure = () => textRef.current && setShift(Math.max(0, textRef.current.offsetWidth - el.clientWidth));
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        // the web font can land after the first measure and change the width
        document.fonts?.ready.then(measure);
        measure();
        return () => observer.disconnect();
    }, [children, still]);

    // anything under a couple of pixels is just rounding
    const scrolling = shift > 2;

    return (
        <Tag
            ref={ref}
            className={`marquee${scrolling ? " marquee--scrolling" : ""}${className ? ` ${className}` : ""}`}
            style={
                scrolling
                    ? {
                          "--marquee-shift": `${shift}px`,
                          "--marquee-duration": `${Math.max(3, shift / SPEED / (1 - 2 * HOLD))}s`,
                      }
                    : undefined
            }
            title={still && typeof children === "string" ? children : undefined}
        >
            <span ref={textRef} className="marquee__text">{children}</span>
        </Tag>
    );
};

Marquee.propTypes = {
    as: PropTypes.elementType,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default Marquee;
