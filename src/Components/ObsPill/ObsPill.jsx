import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ObsPill.scss";

const pad = (n) => String(n).padStart(2, "0");

// A copy of obs-hud's status pill, with the recording timer running
const ObsPill = ({ startAt = 754 }) => {
    const [seconds, setSeconds] = useState(startAt);

    useEffect(() => {
        const id = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <span className="obs-pill" aria-hidden="true">
            <span className="obs-pill__item">
                <i className="obs-pill__dot obs-pill__dot--rec" />
                REC {Math.floor(seconds / 60)}:{pad(seconds % 60)}
            </span>
            <span className="obs-pill__item">
                <i className="obs-pill__dot obs-pill__dot--replay" />
                REPLAY
            </span>
        </span>
    );
};

ObsPill.propTypes = {
    // seconds already "recorded" when the pill first renders
    startAt: PropTypes.number,
};

export default ObsPill;
