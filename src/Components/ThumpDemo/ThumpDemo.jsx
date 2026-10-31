import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { coverPalette } from "../../lib/useCoverColor";
import useMediaQuery from "../../lib/useMediaQuery";
import "./ThumpDemo.scss";

const BPM = 128;
const BEAT_MS = 60_000 / BPM;
const BANDS = ["sub", "bass", "lo-mid", "mid", "high", "air"];
const LIGHTS = 4;
// With nothing playing, the lights take the presence colour like the site's accent does (--green
// and --yellow in index.scss), except offline, where grey lights would look dead: a preset instead
const PRESENCE = { active: ["133 238 20"], idle: ["232 197 71"] };
const PRESET = ["255 46 99", "255 140 26", "120 60 255", "0 190 255"];
const STATUS = { active: "i'm at the pc", idle: "i'm away from the pc", off: "using a preset" };
const SAMPLE_SIZE = 32;

// Like Thump, every light gets its own colour: a cover with fewer colours than lights gets close
// variations of the ones it has (redder, ambery, deeper, softer)
function spread(palette) {
    const shifts = [
        [0, 0, 0],
        [28, -10, -24],
        [-40, -40, -40],
        [40, 40, 40],
    ];
    return Array.from({ length: LIGHTS }, (_, i) => {
        if (i < palette.length) return palette[i];
        const base = palette[i % palette.length].split(" ").map(Number);
        const shift = shifts[Math.floor(i / palette.length) % shifts.length];
        return base.map((c, j) => Math.max(0, Math.min(255, c + shift[j]))).join(" ");
    });
}

// The main colours of an image, or null until (or unless) its pixels can be read
const useImagePalette = (src) => {
    const [palette, setPalette] = useState(null);

    useEffect(() => {
        setPalette(null);
        if (!src) return undefined;
        let cancelled = false;
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = src;
        image
            .decode()
            .then(() => {
                const canvas = document.createElement("canvas");
                canvas.width = SAMPLE_SIZE;
                canvas.height = SAMPLE_SIZE;
                const context = canvas.getContext("2d", { willReadFrequently: true });
                context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
                if (!cancelled) setPalette(coverPalette(context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data));
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [src]);

    return palette;
};

// How loud each band is `ms` into a made-up techno loop: a kick on every beat (dropping out for
// the last bar of every eight), a rolling bassline between kicks, off-beat hats and a wobbly lead
function loopLevels(ms) {
    const beat = ms / BEAT_MS;
    const sinceBeat = (beat % 1) * BEAT_MS;
    const breakdown = Math.floor(beat / 4) % 8 === 7;
    const kick = breakdown ? 0 : Math.exp(-sinceBeat / 160);
    const sixteenth = (beat * 4) % 1;
    const rolling = breakdown ? 0.3 : 0.55 * Math.exp(-sixteenth * 2.5) * (Math.floor(beat * 4) % 4 === 0 ? 0 : 1);
    const hat = Math.exp(-Math.abs((beat % 1) - 0.5) * 14);
    const wobble = 0.5 + 0.25 * Math.sin(ms / 900) + 0.1 * Math.sin(ms / 170);

    return {
        kick,
        bands: [
            Math.max(kick, rolling * 0.6),
            Math.max(kick * 0.9, rolling),
            0.35 + kick * 0.35 + rolling * 0.2,
            wobble,
            0.25 + hat * 0.6,
            0.08 + hat * 0.35,
        ],
    };
}

// A copy of Thump's side panel, playing along to a 128 BPM loop: the lights take the colours of
// whatever I'm playing on Spotify (or a preset), pulse on the kick and pass their colours one
// light along on every kick, like Thump's "step on kick"
const ThumpDemo = ({ music, presence = "off" }) => {
    const root = useRef(null);
    const still = useMediaQuery("(prefers-reduced-motion: reduce)");
    const cover = useImagePalette(music?.image);
    const colours = spread(cover ?? PRESENCE[presence] ?? PRESET);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const el = root.current;
        if (!el) return undefined;
        const bars = el.querySelectorAll(".thump-demo__bar i");
        const lights = el.querySelectorAll(".thump-demo__light");
        const badge = el.querySelector(".thump-demo__kick");

        if (still) {
            const { bands } = loopLevels(BEAT_MS * 0.02);
            bars.forEach((bar, i) => bar.style.setProperty("--level", bands[i].toFixed(3)));
            return undefined;
        }

        let frame;
        let lastBeat = -1;
        const start = performance.now();
        const tick = (now) => {
            frame = requestAnimationFrame(tick);
            const ms = now - start;
            const { kick, bands } = loopLevels(ms);
            bars.forEach((bar, i) => bar.style.setProperty("--level", Math.min(1, bands[i]).toFixed(3)));
            lights.forEach((light, i) => {
                // the first light is on "Kick", the rest on "Bass"
                const level = i === 0 ? 0.25 + kick * 0.75 : 0.45 + bands[1] * 0.55;
                light.style.setProperty("--level", level.toFixed(3));
            });
            badge.classList.toggle("is-on", kick > 0.3);

            const beat = Math.floor(ms / BEAT_MS);
            if (beat !== lastBeat && kick > 0.5) setStep((s) => s + 1);
            lastBeat = beat;
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [still]);

    return (
        <div className="thump-demo" ref={root} aria-hidden="true">
            <div className="thump-demo__card thump-demo__playing">
                {music?.image ? <img src={music.image} alt="" width="44" height="44" /> : <span className="thump-demo__art" />}
                <div>
                    <small>now playing</small>
                    <b>{music ? music.title : "nothing right now"}</b>
                    <span>{music ? music.artist : STATUS[presence]}</span>
                </div>
            </div>

            <div className="thump-demo__card">
                <small>lights</small>
                <div className="thump-demo__lights">
                    {colours.map((_, i) => (
                        <i
                            key={i}
                            className="thump-demo__light"
                            style={{ "--colour": colours[(i + (still ? 0 : step)) % LIGHTS] }}
                        />
                    ))}
                </div>
            </div>

            <div className="thump-demo__card">
                <div className="thump-demo__head">
                    <small>spectrum</small>
                    <span className="thump-demo__kick">kick</span>
                </div>
                <div className="thump-demo__bars">
                    {BANDS.map((band) => (
                        <div key={band} className="thump-demo__bar">
                            <span>
                                <i />
                            </span>
                            <small>{band}</small>
                        </div>
                    ))}
                </div>
                <div className="thump-demo__tempo">{BPM} BPM · locked to the beat</div>
            </div>
        </div>
    );
};

ThumpDemo.propTypes = {
    // what's playing on Spotify, from the live stats
    music: PropTypes.shape({
        title: PropTypes.string,
        artist: PropTypes.string,
        image: PropTypes.string,
    }),
    // whether I'm at the PC, as presenceTone gives it
    presence: PropTypes.oneOf(["active", "idle", "off"]),
};

export default ThumpDemo;
