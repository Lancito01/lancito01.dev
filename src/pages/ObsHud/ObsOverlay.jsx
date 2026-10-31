import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import PropTypes from "prop-types";
import ObsToast from "../../Components/ObsToast/ObsToast";
import { OBS_COLOURS } from "../../lib/obsColours";
import { playChime } from "../../lib/obsSounds";
import "./ObsOverlay.scss";

const FIRST_MS = 5_000;
// a random wait in this range between pop-ups
const GAP_MS = [20_000, 30_000];
const SHOW_MS = 4_000;
const SCENE = "lancito01.dev";

const pad = (n) => String(n).padStart(2, "0");
const clock = (ms) => `${Math.floor(ms / 60_000)}:${pad(Math.floor(ms / 1000) % 60)}`;
const fileTime = (date) => `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;

// obs-hud's own demo, in order: what each step does to OBS's state and the pop-up it shows
const steps = [
    (s) => ({ ...s, replay: true, toast: ["replay", "teal", "Replay buffer on", "Clips save the last 50 s", "replay_on"] }),
    (s) => ({
        ...s,
        clips: s.clips + 1,
        toast: ["check", "green", "Clip saved", `#${s.clips + 1} · Replay ${fileTime(new Date())}.mp4 · 62 MB`, "clip"],
    }),
    (s, now) => ({ ...s, rec: { since: now, pausedAt: null }, toast: ["rec", "red", "Recording started", "Replay buffer is on too", "rec_start"] }),
    (s, now) => ({ ...s, rec: { ...s.rec, pausedAt: now }, toast: ["pause", "amber", "Recording paused", `at ${clock(now - s.rec.since)}`, "pause"] }),
    (s, now) => {
        const length = s.rec.pausedAt - s.rec.since;
        return { ...s, rec: { since: now - length, pausedAt: null }, toast: ["rec", "red", "Recording resumed", `from ${clock(length)}`, "resume"] };
    },
    (s) => ({
        ...s,
        clips: s.clips + 1,
        toast: ["check", "green", "Clip saved", `#${s.clips + 1} · Replay ${fileTime(new Date())}.mp4 · 62 MB`, "clip"],
    }),
    (s, now) => {
        const length = now - s.rec.since;
        const size = Math.max(1, Math.round(length / 1000 / 4));
        return {
            ...s,
            rec: null,
            toast: ["check", "green", "Recording saved", `${clock(length)} · ${fileTime(new Date())}.mp4 · ${size} MB`, "rec_stop"],
        };
    },
    (s) => ({ ...s, replay: false, toast: ["stop", "gray", "Replay buffer off", "Nothing is being buffered", "replay_off"] }),
    (s) => ({ ...s, replay: true, toast: ["replay", "teal", "Replay buffer on", "Clips save the last 50 s", "replay_on"] }),
    (s) => ({
        ...s,
        clips: s.clips + 1,
        toast: ["check", "green", "Clip saved", `#${s.clips + 1} · Replay ${fileTime(new Date())}.mp4 · 62 MB`, "clip"],
    }),
    // with the replay buffer still on, so "still recording or buffering" is true
    (s) => ({
        ...s,
        rec: null,
        replay: false,
        toast: ["warn", "amber", "Lost connection to OBS", "It was still recording or buffering", "warn"],
    }),
];

export const Pill = ({ rec, replay, now }) => {
    if (!rec && !replay) return null;
    const paused = rec?.pausedAt != null;
    return (
        <span className="obs-overlay__pill">
            {rec && (
                <span>
                    <i style={{ background: paused ? OBS_COLOURS.amber : OBS_COLOURS.red }} />
                    {paused ? "PAUSED" : "REC"} {clock((paused ? rec.pausedAt : now) - rec.since)}
                </span>
            )}
            {replay && (
                <span>
                    <i style={{ background: OBS_COLOURS.teal }} />
                    REPLAY
                </span>
            )}
        </span>
    );
};

Pill.propTypes = {
    rec: PropTypes.shape({ since: PropTypes.number, pausedAt: PropTypes.number }),
    replay: PropTypes.bool,
    now: PropTypes.number.isRequired,
};

// obs-hud "running" on the page: every 20 to 30 seconds OBS does something (the replay buffer
// starts, a clip saves, a recording starts...) and its pop-up shows in the corner with its sound,
// with the status pill above it while something's running. Sounds only play once the visitor has
// clicked or typed on the page, and only when `sounds` is on.
const ObsOverlay = ({ sounds }) => {
    const machine = useRef({ step: 0, clips: 0, rec: null, replay: false, toast: null, shown: 0 });
    const [state, setState] = useState(machine.current);
    const [visible, setVisible] = useState(false);
    const [now, setNow] = useState(Date.now());
    const soundsRef = useRef(sounds);
    soundsRef.current = sounds;

    useEffect(() => {
        let timer;
        let hide;
        const next = (wait) => {
            timer = setTimeout(() => {
                // nobody to see it in a background tab, so wait for the next one
                if (document.visibilityState === "visible") {
                    const s = machine.current;
                    const after = steps[s.step](s, Date.now());
                    machine.current = { ...after, step: (s.step + 1) % steps.length, shown: s.shown + 1 };
                    setState(machine.current);
                    if (soundsRef.current) playChime(after.toast[4]);
                    setVisible(true);
                    clearTimeout(hide);
                    hide = setTimeout(() => setVisible(false), SHOW_MS);
                }
                next(GAP_MS[0] + Math.random() * (GAP_MS[1] - GAP_MS[0]));
            }, wait);
        };
        next(FIRST_MS);
        return () => {
            clearTimeout(timer);
            clearTimeout(hide);
        };
    }, []);

    // the pill's recording clock
    const recording = state.rec && state.rec.pausedAt == null;
    useEffect(() => {
        if (!recording) return undefined;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [recording]);

    const [glyph, accent, title, detail] = state.toast ?? [];

    return createPortal(
        <div className="obs-overlay" aria-live="polite">
            <Pill rec={state.rec} replay={state.replay} now={Math.max(now, state.rec?.since ?? 0)} />
            <AnimatePresence>
                {visible && state.toast && (
                    <motion.div
                        key={state.shown}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                        <ObsToast glyph={glyph} accent={accent} title={title} detail={detail} tag={SCENE} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>,
        document.body,
    );
};

ObsOverlay.propTypes = {
    sounds: PropTypes.bool.isRequired,
};

export default ObsOverlay;
