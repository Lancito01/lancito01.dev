import PropTypes from "prop-types";
import { OBS_COLOURS } from "../../lib/obsColours";
import "./ObsToast.scss";

// obs-hud's glyphs (Badge in ObsHud.cs)
const GLYPHS = {
    rec: <circle cx="12" cy="12" r="5" fill="#fff" />,
    stop: <rect x="7.7" y="7.7" width="8.6" height="8.6" rx="1.4" fill="#fff" />,
    pause: (
        <g fill="#fff">
            <rect x="7.7" y="7.2" width="3" height="9.6" />
            <rect x="13.3" y="7.2" width="3" height="9.6" />
        </g>
    ),
    check: <path d="M7 12.2l3.6 3.6 6.7-7.6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
    replay: (
        <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <path d="M9.6 7.3a5.5 5.5 0 1 0 4.8 0" />
            <path d="M14.4 7.3l.4 3M14.4 7.3l3-.6" />
        </g>
    ),
    warn: (
        <g fill="#fff">
            <rect x="10.9" y="6.4" width="2.2" height="7" rx="1.1" />
            <circle cx="12" cy="16.6" r="1.6" />
        </g>
    ),
};

// One of obs-hud's pop-ups: a round badge, a title with the current scene as a chip, and a detail line
const ObsToast = ({ glyph, accent, title, detail, tag }) => (
    <div className="obs-toast">
        <svg className="obs-toast__badge" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="12" fill={OBS_COLOURS[accent]} />
            {GLYPHS[glyph]}
        </svg>
        <div className="obs-toast__text">
            <div className="obs-toast__title">
                <b>{title}</b>
                {tag && <span>{tag}</span>}
            </div>
            {detail && <p>{detail}</p>}
        </div>
    </div>
);

ObsToast.propTypes = {
    glyph: PropTypes.oneOf(Object.keys(GLYPHS)).isRequired,
    accent: PropTypes.oneOf(Object.keys(OBS_COLOURS)).isRequired,
    title: PropTypes.string.isRequired,
    detail: PropTypes.string,
    tag: PropTypes.string,
};

export default ObsToast;
