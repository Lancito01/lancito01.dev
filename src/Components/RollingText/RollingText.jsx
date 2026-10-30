import { useState } from "react";
import PropTypes from "prop-types";
import "./RollingText.scss";

// The new digit rolls up in as the old one rolls out above it. Both are keyed by the change,
// so a digit that changes again mid-roll (a number counting up fast) starts both over cleanly
// instead of piling up copies. A `still` digit just swaps in place.
const Digit = ({ char, still }) => {
    const [shown, setShown] = useState({ char, previous: null, change: 0 });
    if (shown.char !== char) {
        setShown(still ? { ...shown, char, previous: null } : { char, previous: shown.char, change: shown.change + 1 });
    }

    return (
        <span className="rolling__digit">
            {shown.previous !== null && (
                <span key={`out${shown.change}`} className="rolling__out" aria-hidden="true">
                    {shown.previous}
                </span>
            )}
            <span key={`in${shown.change}`} className={shown.change ? "rolling__in" : undefined}>
                {char}
            </span>
        </span>
    );
};

Digit.propTypes = {
    char: PropTypes.string.isRequired,
    still: PropTypes.bool,
};

// Digits are keyed from the right, so when a number gains a digit (999 → 1,000) the ones
// already there stay put instead of all rolling. While `still`, changes show up without rolling.
const RollingText = ({ text, className, still = false }) => (
    <span className={`rolling${className ? ` ${className}` : ""}`}>
        {[...text].map((char, i) => {
            const place = text.length - i;
            return /\d/.test(char) ? <Digit key={place} char={char} still={still} /> : <span key={place}>{char}</span>;
        })}
    </span>
);

RollingText.propTypes = {
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
    still: PropTypes.bool,
};

export default RollingText;
