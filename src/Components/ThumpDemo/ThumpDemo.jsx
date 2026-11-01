import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { BEAT_MS, BPM, LIGHTS, lightLevels, loopLevels, useThumpColours } from "../../lib/thumpLoop";
import { presenceTone } from "../../lib/useSiteAccent";
import useMediaQuery from "../../lib/useMediaQuery";
import "./ThumpDemo.scss";

const BANDS = ["sub", "bass", "lo-mid", "mid", "high", "air"];
const DRUMS = ["kick", "clap", "hat"];
const ROLES = ["kick", "clap", "hats", "bass"];
const STATUS = { active: "i'm at the pc", idle: "i'm away from the pc", off: "using a preset" };

// A copy of Thump's side panel, playing along to a 128 BPM loop: the lights take the colours of
// whatever I'm playing on Spotify (or a preset), each follows a drum (or the bass) like Thump's
// light roles, and they pass their colours one light along on every kick, like its "step on kick"
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
        const leds = el.querySelectorAll(".thump-demo__led");

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
            const levels = loopLevels(ms);
            const { kick, bands } = levels;
            bars.forEach((bar, i) => bar.style.setProperty("--level", Math.min(1, bands[i]).toFixed(3)));
            lightLevels(levels).forEach((level, i) => lights[i].style.setProperty("--level", level.toFixed(3)));
            // the LEDs light up pink as Kickstep hears each drum
            leds.forEach((led, i) => led.style.setProperty("--level", levels[DRUMS[i]].toFixed(3)));

            const beat = Math.floor(ms / BEAT_MS);
            if (beat !== lastBeat && kick > 0.5) setStep((s) => s + 1);
            lastBeat = beat;
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [still]);

    return (
        <div className="thump-demo" ref={root} aria-hidden="true">
            <div className="thump-demo__grid">
                <div className="thump-demo__card thump-demo__playing">
                    {music?.image ? (
                        <img src={music.image} alt="" width="44" height="44" />
                    ) : (
                        <span className="thump-demo__art" />
                    )}
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
                            <div key={i} className="thump-demo__role">
                                <i
                                    className="thump-demo__light"
                                    style={{ "--colour": colours[(i + (still ? 0 : step)) % LIGHTS] }}
                                />
                                <small>{ROLES[i]}</small>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="thump-demo__card">
                    <div className="thump-demo__head">
                        <small>spectrum</small>
                        <span className="thump-demo__leds">
                            {ROLES.slice(0, 3).map((drum) => (
                                <span key={drum} className="thump-demo__led">
                                    {drum}
                                </span>
                            ))}
                        </span>
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
                    <div className="thump-demo__tempo">
                        {BPM} BPM · tempo confidence 96%
                        <br />
                        Drums: Kickstep (kick, clap/snare, hats)
                    </div>
                </div>
            </div>
        </div>
    );
};

ThumpDemo.propTypes = {
    // what my PC and Spotify are up to, from useLiveStats
    live: PropTypes.object,
};

export default ThumpDemo;
