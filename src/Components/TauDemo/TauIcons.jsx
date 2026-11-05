import PropTypes from "prop-types";

// Stand-ins for the Segoe icons the real wheel draws, which only ship with Windows
const PATHS = {
    compress: "M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7",
    clean: "M3 12V4h8l10 10-8 8zM8 8h.01",
    metadata: "M3 12V4h8l10 10-8 8zM8 8h.01",
    edit: "M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-2 0-3 2-1 3-1h1a3 3 0 0 0 3-3c0-5-4-9-9-9zM7.5 11h.01M10 7.5h.01M15 7.5h.01",
    annotate: "M4 20l1-5L16 4l4 4L9 19zM14 6l4 4",
    background: "M4 4h16v16H4zM4 12h16M12 4v16",
    crop: "M6 2v16h16M2 6h16v16",
    redact: "M5 3h14v18H5zM8 9h8v6H8z",
    mute: "M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6",
    trim: "M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8.5 8L20 19M8.5 16L20 5",
    speed: "M4 18a9 9 0 1 1 16 0M12 14l4-5",
    snapshot: "M3 7h4l2-3h6l2 3h4v13H3zM12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
    split: "M12 3v18M8 8l-4 4 4 4M16 8l4 4-4 4",
    normalize: "M4 10v4M8 6v12M12 9v6M16 6v12M20 10v4",
    visualize: "M3 17l5-6 4 3 4-7 5 6",
    channels: "M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H4zM17 15h3v5h-3z",
    bleep: "M3 12h4l2-6 3 12 3-12 2 6h4",
    organize: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
    extract: "M12 3v12M7 10l5 5 5-5M4 20h16",
    share: "M12 15V3M7 8l5-5 5 5M5 13v8h14v-8",
    shelf: "M3 8h18M3 16h18M6 4h4v4H6zM13 12h5v4h-5z",
    copy: "M8 8h12v13H8zM4 16V3h12",
    move: "M3 6h6l2 3h10v11H3zM9 14h8M14 11l3 3-3 3",
    path: "M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1",
    terminal: "M4 5h16v14H4zM8 9l3 3-3 3M13 15h4",
};

export const TauIcon = ({ name }) => (
    <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d={PATHS[name]} />
    </svg>
);

TauIcon.propTypes = {
    name: PropTypes.string.isRequired,
};

export const TauLogo = ({ size = 28 }) => (
    <svg viewBox="0 0 256 256" width={size} height={size} aria-hidden="true">
        <circle cx="128" cy="128" r="128" fill="#c8f135" />
        <path
            d="M69 92h123M128 92v62q0 30 36 30"
            fill="none"
            stroke="#12140a"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="12"
        />
    </svg>
);

TauLogo.propTypes = {
    size: PropTypes.number,
};
