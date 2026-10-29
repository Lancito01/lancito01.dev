import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PropTypes from "prop-types";
import useAverageColor from "../../lib/useAverageColor";
import { pickActivePhrase } from "./statusPhrases";
import "./LiveStrip.scss";

const number = new Intl.NumberFormat("en-US");

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86_400);
    const hours = Math.floor((seconds % 86_400) / 3_600);
    const minutes = Math.floor((seconds % 3_600) / 60);
    if (days) return `${days}d ${hours}h`;
    if (hours) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

const formatDistance = (metres) => (metres >= 1000 ? `${(metres / 1000).toFixed(1)} km` : `${Math.round(metres)} m`);

function formatTrackTime(ms) {
    const seconds = Math.floor(ms / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

const Meter = ({ label, text, fraction }) => (
    <div className="live__meter">
        <span className="live__label mono">{label}</span>
        <span className="live__meter-value">{text}</span>
        <span className="live__bar">
            <i style={{ transform: `scaleX(${Math.min(1, Math.max(0, fraction))})` }} />
        </span>
    </div>
);

Meter.propTypes = {
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    fraction: PropTypes.number.isRequired,
};

const Count = ({ label, value }) => (
    <div className="live__count">
        <b>{value}</b>
        <span className="live__label mono">{label}</span>
    </div>
);

Count.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

const PcSections = ({ pc }) => {
    // Picked once per page load, so it doesn't change under you while you read
    const [phrase] = useState(pickActivePhrase);
    const away = pc.status === "away";
    const hasLoad = pc.cpu !== undefined || pc.gpu !== undefined || pc.ramTotal !== undefined;
    const hasToday = pc.clicks !== undefined || pc.mouse !== undefined;

    return (
        <>
            <div className="live__section">
                <span className="live__label mono">my pc</span>
                <p className="live__status">
                    <i className={`live__dot${away ? " live__dot--away" : ""}`} />
                    {away ? "idle, on but i stepped away" : phrase}
                </p>
                {pc.uptime !== undefined && <p className="live__note mono">on for {formatUptime(pc.uptime)}</p>}
                {pc.app && (
                    <p className="live__app">
                        in <b>{pc.app}</b>
                        {pc.appInfo && <span>{pc.appInfo}</span>}
                    </p>
                )}
            </div>

            {hasLoad && (
                <div className="live__section">
                    <span className="live__label mono">load</span>
                    <div className="live__meters">
                        {pc.cpu !== undefined && <Meter label="cpu" text={`${pc.cpu}%`} fraction={pc.cpu / 100} />}
                        {pc.gpu !== undefined && <Meter label="gpu" text={`${pc.gpu}%`} fraction={pc.gpu / 100} />}
                        {pc.ramTotal !== undefined && (
                            <Meter
                                label="ram"
                                text={`${pc.ramUsed.toFixed(1)} / ${Math.round(pc.ramTotal)} gb`}
                                fraction={pc.ramUsed / pc.ramTotal}
                            />
                        )}
                    </div>
                </div>
            )}

            {hasToday && (
                <div className="live__section">
                    <span className="live__label mono">today</span>
                    <div className="live__counts">
                        {pc.clicks !== undefined && <Count label="clicks" value={number.format(pc.clicks)} />}
                        {pc.keys !== undefined && <Count label="keys" value={number.format(pc.keys)} />}
                        {pc.scrolls !== undefined && <Count label="scrolls" value={number.format(pc.scrolls)} />}
                        {pc.mouse !== undefined && <Count label="of mouse" value={formatDistance(pc.mouse)} />}
                    </div>
                </div>
            )}
        </>
    );
};

PcSections.propTypes = {
    pc: PropTypes.shape({
        status: PropTypes.oneOf(["active", "away"]),
        uptime: PropTypes.number,
        cpu: PropTypes.number,
        gpu: PropTypes.number,
        ramUsed: PropTypes.number,
        ramTotal: PropTypes.number,
        clicks: PropTypes.number,
        keys: PropTypes.number,
        scrolls: PropTypes.number,
        mouse: PropTypes.number,
        app: PropTypes.string,
        appInfo: PropTypes.string,
    }).isRequired,
};

// The played part of the song is drawn as y = (1 - e^(-a·x))·sin(4x + n), with x counted back from the
// playhead: flat where the song is now and growing into a steady wave behind it, with n sliding from
// π down to -π so the wave flows back from the playhead into the played part
const WAVE = {
    pxPerUnit: 20, // screen px per unit of x, so one wavelength (2π/4 units) is about 31px
    a: 1, // how quickly the wave grows out of the flat start
    amplitude: 3, // px
    cycleMs: 1500, // how long n takes to go from π to -π
    height: 10,
};

const MusicWave = ({ progressMs, durationMs, at }) => {
    const svgRef = useRef(null);
    const waveRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => {
        const still = window.matchMedia("(prefers-reduced-motion: reduce)");
        const mid = WAVE.height / 2;
        let frame;

        const draw = (time) => {
            const width = svgRef.current.clientWidth;
            // The API answer can be a few seconds old, so move the song along from when it was made
            const elapsed = Math.min(durationMs, progressMs + Math.max(0, Date.now() - at));
            const played = (elapsed / durationMs) * width;
            const n = still.matches ? 0 : Math.PI - ((time / WAVE.cycleMs) % 1) * 2 * Math.PI;
            const y = (px) => {
                const x = (played - px) / WAVE.pxPerUnit;
                return mid - WAVE.amplitude * (1 - Math.exp(-WAVE.a * x)) * Math.sin(4 * x + n);
            };

            let path = `M0 ${y(0).toFixed(2)}`;
            for (let px = 1; px < played; px += 1) path += `L${px} ${y(px).toFixed(2)}`;
            if (played > 0) path += `L${played.toFixed(2)} ${y(played).toFixed(2)}`;
            waveRef.current.setAttribute("d", path);
            trackRef.current.setAttribute("x1", played);
            trackRef.current.setAttribute("x2", width);

            frame = requestAnimationFrame(draw);
        };

        frame = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frame);
    }, [progressMs, durationMs, at]);

    return (
        <svg ref={svgRef} className="live__wave" height={WAVE.height} aria-hidden="true">
            <line ref={trackRef} y1={WAVE.height / 2} y2={WAVE.height / 2} />
            <path ref={waveRef} />
        </svg>
    );
};

MusicWave.propTypes = {
    progressMs: PropTypes.number.isRequired,
    durationMs: PropTypes.number.isRequired,
    at: PropTypes.number.isRequired,
};

const Music = ({ music, at, now }) => {
    // The API answer can be a few seconds old, so move the song along from when it was made
    const progress = Math.min(music.durationMs, music.progressMs + Math.max(0, now - at));
    const Wrapper = music.url ? "a" : "div";
    const tint = useAverageColor(music.image);

    return (
        <div className="live__section live__section--music" style={tint ? { "--tint": `rgb(${tint})` } : undefined}>
            <span className="live__label mono">listening to</span>
            <Wrapper
                className="live__track"
                {...(music.url && { href: music.url, target: "_blank", rel: "noreferrer" })}
            >
                {music.image ? (
                    <img src={music.image} alt="" width="52" height="52" />
                ) : (
                    <span className="live__cover" aria-hidden="true">
                        ♪
                    </span>
                )}
                <span className="live__track-text">
                    <b>{music.title}</b>
                    <span>{music.artist}</span>
                </span>
            </Wrapper>
            {music.durationMs > 0 && (
                <div className="live__progress">
                    <MusicWave progressMs={music.progressMs} durationMs={music.durationMs} at={at} />
                    <span className="mono">
                        {formatTrackTime(progress)} / {formatTrackTime(music.durationMs)}
                    </span>
                </div>
            )}
        </div>
    );
};

Music.propTypes = {
    music: PropTypes.shape({
        title: PropTypes.string.isRequired,
        artist: PropTypes.string,
        image: PropTypes.string,
        url: PropTypes.string,
        progressMs: PropTypes.number.isRequired,
        durationMs: PropTypes.number.isRequired,
    }).isRequired,
    at: PropTypes.number.isRequired,
    now: PropTypes.number.isRequired,
};

// Shows up only while my PC is reporting in or something's playing on Spotify,
// and slides the rest of the page down to make room
const LiveStrip = ({ data, now }) => {
    const pc = data?.pc?.online ? data.pc : null;
    const music = data?.music ?? null;

    return (
        <AnimatePresence initial={false}>
            {(pc || music) && (
                <motion.section
                    key="live"
                    className="live-wrap"
                    aria-labelledby="live-title"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                >
                    <div className="wrap live-wrap__inner">
                        <div className="live__head">
                            <h2 id="live-title">right now</h2>
                            <span className="mono">
                                {pc ? "live from my pc, updated every few seconds" : "playing on spotify"}
                            </span>
                        </div>
                        <div className={`live${pc ? "" : " live--music-only"}`}>
                            {pc && <PcSections pc={pc} />}
                            {music && <Music music={music} at={data.at} now={now} />}
                        </div>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
};

LiveStrip.propTypes = {
    data: PropTypes.shape({
        at: PropTypes.number,
        pc: PropTypes.shape({ online: PropTypes.bool }),
        music: PropTypes.object,
    }),
    now: PropTypes.number.isRequired,
};

export default LiveStrip;
