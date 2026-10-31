import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { BEAT_MS, BPM, LIGHTS, loopLevels, useThumpColours } from "../../lib/thumpLoop";
import { presenceTone } from "../../lib/useSiteAccent";
import useMediaQuery from "../../lib/useMediaQuery";
import "./ThumpDemo.scss";

const BANDS = ["sub", "bass", "lo-mid", "mid", "high", "air"];
const STATUS = { active: "i'm at the pc", idle: "i'm away from the pc", off: "using a preset" };

// A copy of Thump's side panel, playing along to a 128 BPM loop: the lights take the colours of
// whatever I'm playing on Spotify (or a preset), pulse on the kick and pass their colours one
// light along on every kick, like Thump's "step on kick"
const ThumpDemo = ({ live }) => {
    const root = useRef(null);
    const still = useMediaQuery("(prefers-reduced-motion: reduce)");
    const colours = useThumpColours(live);
    const music = live?.music ?? null;
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
        const tick = (now) => {
            frame = requestAnimationFrame(tick);
            // on the page's own clock, so every Thump demo on a page keeps the same beat
            const ms = now;
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
                    <span>{music ? music.artist : STATUS[presenceTone(live)]}</span>
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
    // what my PC and Spotify are up to, from useLiveStats
    live: PropTypes.object,
};

export default ThumpDemo;
