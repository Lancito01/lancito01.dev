import { useState } from "react";
import ObsPill from "../../Components/ObsPill/ObsPill";
import ObsToast from "../../Components/ObsToast/ObsToast";
import ObsOverlay from "./ObsOverlay";
import { playChime } from "../../lib/obsSounds";
import { obsHudLinks } from "../../data/links";
import heroImage from "../../assets/obs/hero.webp";
import pillsImage from "../../assets/obs/pills.webp";
import "../page.scss";
import "./ObsHud.scss";

const SOUNDS_KEY = "obs-hud-sounds";

const sounds = [
    { name: "clip", label: "clip saved", glyph: "check", accent: "green" },
    { name: "rec_start", label: "recording started", glyph: "rec", accent: "red" },
    { name: "rec_stop", label: "recording saved", glyph: "check", accent: "green" },
    { name: "pause", label: "paused", glyph: "pause", accent: "amber" },
    { name: "resume", label: "resumed", glyph: "rec", accent: "red" },
    { name: "replay_on", label: "replay buffer on", glyph: "replay", accent: "teal" },
    { name: "replay_off", label: "replay buffer off", glyph: "stop", accent: "gray" },
    { name: "warn", label: "something's wrong", glyph: "warn", accent: "amber" },
];

const settings = [
    ["Position", "TopLeft, TopCenter, TopRight, BottomLeft, BottomCenter or BottomRight"],
    ["PeekHotkey", "a hotkey that flashes the current status, like Ctrl+Alt+S"],
    ["Device", "play the sounds on a device obs doesn't record, so the beeps stay out of your clips"],
    ["Rtss", "1 to draw through rtss in exclusive fullscreen games"],
    ["AutoUpdate", "1 (the default) downloads new versions in the background and asks you to restart"],
];

const readSounds = () => {
    try {
        return localStorage.getItem(SOUNDS_KEY) !== "off";
    } catch {
        return true;
    }
};

const ObsHud = () => {
    const [soundsOn, setSoundsOn] = useState(readSounds);

    const toggleSounds = () => {
        const on = !soundsOn;
        setSoundsOn(on);
        try {
            localStorage.setItem(SOUNDS_KEY, on ? "on" : "off");
        } catch {
            // it just won't be remembered next time
        }
    };

    return (
        <div className="wrap page obs-page">
            <ObsOverlay sounds={soundsOn} />

            <h1 className="page__title">
                <span className="prompt">&gt;</span>obs-hud
            </h1>
            <p className="page__intro">
                see at a glance whether obs is recording or buffering, with a pop-up and a sound every time something
                happens. it&apos;s running on this page right now: keep an eye on the bottom right corner.
            </p>
            <div className="page__links">
                <a href={obsHudLinks.download} target="_blank" rel="noreferrer">
                    download
                </a>
                <a href={obsHudLinks.github} target="_blank" rel="noreferrer">
                    source
                </a>
                <button type="button" className="obs-page__toggle mono" onClick={toggleSounds} aria-pressed={soundsOn}>
                    sounds: {soundsOn ? "on" : "off"}
                </button>
            </div>

            <figure className="obs-page__hero">
                <img
                    src={heroImage}
                    alt="obs-hud over a game: a REC and REPLAY pill with a Clip saved notification below it"
                    width="1600"
                    height="420"
                />
            </figure>

            <section className="page__section">
                <h2>what it does</h2>
                <ul>
                    <li>it&apos;s click-through and never steals focus, so it&apos;s safe over games</li>
                    <li>it works in exclusive fullscreen games too, through rtss</li>
                    <li>it&apos;s hidden from obs captures, so it never shows up in your clips</li>
                    <li>it uses no cpu while idle: it listens to obs instead of asking it over and over</li>
                    <li>it keeps itself up to date, and asks before restarting</li>
                </ul>
            </section>

            <section className="page__section">
                <h2>what you&apos;ll see</h2>
                <p>a small pill while something is running, with the recording time ticking:</p>
                <div className="obs-page__pills">
                    <ObsPill />
                    <img
                        src={pillsImage}
                        alt="status pills: recording with replay buffer, paused, and replay buffer only"
                        width="754"
                        height="52"
                        loading="lazy"
                    />
                </div>
                <p>and a pop-up for each event, each with its own sound. click one to hear it:</p>
                <ul className="obs-page__sounds">
                    {sounds.map(({ name, label, glyph, accent }) => (
                        <li key={name}>
                            <button type="button" onClick={() => playChime(name)}>
                                <ObsToast glyph={glyph} accent={accent} title={label} />
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="page__section">
                <h2>getting started</h2>
                <ol>
                    <li>
                        in obs 28 or newer, open <b>tools &gt; websocket server settings</b> and tick{" "}
                        <b>enable websocket server</b>.
                    </li>
                    <li>
                        download <b>obs-hud.exe</b> from the{" "}
                        <a href={obsHudLinks.download} target="_blank" rel="noreferrer">
                            latest release
                        </a>
                        , put it in its own folder and run it.
                    </li>
                </ol>
                <p>
                    that&apos;s it. right-click the tray icon to move it, test it or change settings. windows may warn
                    that it&apos;s unsigned the first time: <b>more info &gt; run anyway</b>.
                </p>
            </section>

            <section className="page__section">
                <h2>exclusive fullscreen games</h2>
                <p>
                    games in exclusive fullscreen draw straight to the screen, so no window can show up on top of them,
                    this one included. borderless and windowed games are fine.
                </p>
                <p>
                    if you have rivatuner statistics server (rtss, which comes with msi afterburner), turn on{" "}
                    <b>draw through rtss in exclusive fullscreen</b> from the tray icon. rtss then draws the hud inside
                    the game, looking exactly the same. it only kicks in for exclusive fullscreen, so you never get two
                    pills, and it hides with the rest of your rtss overlay. obs-hud doesn&apos;t hook into games
                    itself.
                </p>
            </section>

            <section className="page__section">
                <h2>settings</h2>
                <p>
                    <code>obs-hud.ini</code> appears next to the exe the first time it runs, and changes apply as soon
                    as you save. the main ones:
                </p>
                <dl className="obs-page__settings">
                    {settings.map(([key, what]) => (
                        <div key={key}>
                            <dt className="mono">{key}</dt>
                            <dd>{what}</dd>
                        </div>
                    ))}
                </dl>
                <p>
                    want your own sounds? drop <code>clip.wav</code>, <code>rec_start.wav</code>,{" "}
                    <code>rec_stop.wav</code> and so on in a <code>sounds</code> folder next to the exe.
                </p>
            </section>

            <section className="page__section">
                <h2>building it</h2>
                <p>
                    run <code>build.cmd</code>. it uses the c# compiler that comes with windows, so there&apos;s
                    nothing to install. the built-in sounds aren&apos;t files either: each one is a few notes
                    synthesised as it starts, which is how this page plays them too.
                </p>
            </section>
        </div>
    );
};

export default ObsHud;
