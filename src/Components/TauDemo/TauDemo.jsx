import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import useMediaQuery from "../../lib/useMediaQuery";
import { KINDS, categoryOf, entriesFor, extOf, formatSize, planFor, tauSamples } from "../../lib/tauCatalog";
import { TauIcon } from "./TauIcons";
import "./TauDemo.scss";

// The real wheel's measurements, from Tau's wheel.rs
const DISC_R = 176;
const ORBIT_R = 124;
const RING_R = 72;
const HUB_R = 52;

const DRAG_START_PX = 4;
const SCROLL_GAP_MS = 140; // a trackpad sends a flood of wheel events, one swipe should move one wheel
const HUD_MS = 4500;
const MAX_RESULTS = 8; // made-up files that stay in the folder before the oldest goes

const nodeSpot = (i, count, radius) => {
    const angle = (i / count) * Math.PI * 2;
    return [Math.sin(angle) * radius, -Math.cos(angle) * radius];
};

// The real wheel picks by angle anywhere outside the hub, so you never have to land on the chip itself
function optionAt(x, y, wheel, count) {
    const dx = (x - wheel.x) / wheel.scale;
    const dy = (y - wheel.y) / wheel.scale;
    if (!count || Math.hypot(dx, dy) < HUB_R) return -1;
    const step = (Math.PI * 2) / count;
    return (Math.round(Math.atan2(dx, -dy) / step) + count) % count;
}

// Opens where the pointer is, like the app, but kept on screen (and shrunk on the narrowest phones)
function placeWheel(x, y) {
    const margin = 8;
    const scale = Math.min(1, (window.innerWidth - margin * 2) / (DISC_R * 2));
    const reach = DISC_R * scale + margin;
    const clamp = (value, size) => (size < reach * 2 ? size / 2 : Math.min(Math.max(value, reach), size - reach));
    return { x: clamp(x, window.innerWidth), y: clamp(y, window.innerHeight), scale };
}

const FileArt = ({ file }) => {
    const cat = categoryOf(file);
    if (file.folder) {
        return (
            <span className="tau-file__art tau-file__art--folder" aria-hidden="true">
                <i />
            </span>
        );
    }
    return (
        <span
            className={`tau-file__art tau-file__art--${cat}${file.art ? " tau-file__art--photo" : ""}`}
            aria-hidden="true"
        >
            <b className="mono">{extOf(file.name)}</b>
        </span>
    );
};

const filePropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    art: PropTypes.string,
    folder: PropTypes.bool,
    fresh: PropTypes.bool,
});

FileArt.propTypes = {
    file: filePropType.isRequired,
};

const Wheel = ({ wheel, file, onChoose, onCancel, onSwitch }) => {
    const entries = entriesFor(file, wheel.kind);
    const active = entries[wheel.active];
    const count = entries.length;
    const interactive = wheel.mode !== "drag";
    const ref = useRef(null);

    // Keeps the marker turning the short way round, even when it crosses the top of the wheel
    const marker = useRef(0);
    if (active) {
        const target = (wheel.active / count) * 360;
        const turn = ((target - marker.current + 540) % 360) - 180;
        marker.current += turn;
    }

    useEffect(() => {
        if (interactive) ref.current?.focus({ preventScroll: true });
    }, [interactive]);

    const onDiscClick = (event) => {
        event.stopPropagation();
        const picked = optionAt(event.clientX, event.clientY, wheel, count);
        if (picked < 0) onCancel();
        else onChoose(picked);
    };

    return (
        <div
            className={`tau-wheel-layer${interactive ? " tau-wheel-layer--open" : ""}`}
            onClick={interactive ? onCancel : undefined}
        >
            <div
                ref={ref}
                className="tau-wheel"
                style={{ left: wheel.x, top: wheel.y, transform: `scale(${wheel.scale})` }}
                role="menu"
                aria-label={`${KINDS[wheel.kind]} ${file.name}`}
                aria-activedescendant={active ? `tau-option-${active.id}` : undefined}
                tabIndex={-1}
                onClick={interactive ? onDiscClick : undefined}
            >
                <svg className="tau-wheel__lines" viewBox={`${-DISC_R} ${-DISC_R} ${DISC_R * 2} ${DISC_R * 2}`} aria-hidden="true">
                    <circle r={RING_R} className="tau-wheel__ring" />
                    {entries.map((entry, i) => {
                        const [x, y] = nodeSpot(i, count, RING_R);
                        return <circle key={entry.id} cx={x} cy={y} r="1.8" className="tau-wheel__tick" />;
                    })}
                    <circle r={HUB_R} className="tau-wheel__hub-ring" />
                    {active && (
                        <g className="tau-wheel__marker" style={{ transform: `rotate(${marker.current}deg)` }}>
                            <path d={`M${-RING_R * 0.34} ${-RING_R * 0.92}Q0 ${-RING_R * 1.08} ${RING_R * 0.34} ${-RING_R * 0.92}`} />
                            <path d={`M0 ${-RING_R}V${-HUB_R}`} />
                        </g>
                    )}
                </svg>

                {/* keyed by wheel, so switching wheels flies the new options out again */}
                <div key={wheel.kind}>
                    {entries.map((entry, i) => {
                        const [x, y] = nodeSpot(i, count, ORBIT_R);
                        const isActive = i === wheel.active;
                        return (
                            <div
                                key={entry.id}
                                id={`tau-option-${entry.id}`}
                                role="menuitem"
                                aria-disabled={entry.blocked ? "true" : undefined}
                                className={`tau-chip${isActive ? " tau-chip--active" : ""}${entry.blocked ? " tau-chip--blocked" : ""}`}
                                style={{ "--x": `${x}px`, "--y": `${y}px` }}
                            >
                                {KINDS[wheel.kind] !== "Convert" && <TauIcon name={entry.id} />}
                                <span className={KINDS[wheel.kind] === "Convert" ? "tau-chip__format" : undefined}>{entry.label}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="tau-wheel__hub">
                    <strong>{active ? active.label : count ? KINDS[wheel.kind] : `No ${KINDS[wheel.kind].toLowerCase()}`}</strong>
                    <small>{active?.blocked ?? (active ? KINDS[wheel.kind] : file.name)}</small>
                    <div className="tau-wheel__pips">
                        {KINDS.map((kind, i) => (
                            <button
                                key={kind}
                                type="button"
                                tabIndex={-1}
                                className={i === wheel.kind ? "is-on" : undefined}
                                aria-label={`Show the ${kind} wheel`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onSwitch(i);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

Wheel.propTypes = {
    wheel: PropTypes.shape({
        kind: PropTypes.number.isRequired,
        active: PropTypes.number.isRequired,
        mode: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        scale: PropTypes.number.isRequired,
    }).isRequired,
    file: filePropType.isRequired,
    onChoose: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSwitch: PropTypes.func.isRequired,
};

// A copy of Tau's wheel on made-up files: drag one, tap a key, drop it on an option. Nothing is
// uploaded, downloaded or converted. The wheel, the file being dragged and the progress card are
// portalled to <body>, because the real ones float over everything, and so that the page's fade-in
// transform can't offset them.
const TauDemo = () => {
    const [files, setFiles] = useState(tauSamples);
    const [lifted, setLifted] = useState(null);
    const [wheel, setWheel] = useState(null);
    const [job, setJob] = useState(null);

    const coarse = useMediaQuery("(pointer: coarse)");
    const still = useMediaQuery("(prefers-reduced-motion: reduce)");

    const trayRef = useRef(null);
    const ghostRef = useRef(null);
    const gesture = useRef(null); // the press in progress on a file
    const pointer = useRef({ x: 0, y: 0 });
    const lastScroll = useRef(0);
    const timers = useRef([]);
    const nextId = useRef(0);

    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    useEffect(() => {
        const pending = timers;
        return () => pending.current.forEach(clearTimeout);
    }, []);

    const tileOf = (id) => trayRef.current?.querySelector(`[data-file="${id}"]`);

    const liftedFile = files.find((file) => file.id === lifted);
    const wheelFile = wheel && files.find((file) => file.id === wheel.fileId);

    const openWheel = (fileId, mode, x, y) => {
        const file = files.find((other) => other.id === fileId);
        const next = { fileId, mode, kind: 0, active: mode === "keys" ? 0 : -1, ...placeWheel(x, y) };
        if (mode !== "keys") next.active = optionAt(pointer.current.x, pointer.current.y, next, entriesFor(file, 0).length);
        setWheel(next);
    };

    const switchWheel = (kind) => {
        setWheel((current) => {
            if (!current) return current;
            const file = files.find((other) => other.id === current.fileId);
            const total = entriesFor(file, kind).length;
            const active = current.mode === "keys" ? (total ? 0 : -1) : optionAt(pointer.current.x, pointer.current.y, current, total);
            return { ...current, kind, active };
        });
    };

    const closeWheel = () => {
        const current = wheel;
        setWheel(null);
        if (current?.mode === "keys") tileOf(current.fileId)?.focus({ preventScroll: true });
    };

    const addResult = (source, result) => {
        const id = `result-${nextId.current++}`;
        setFiles((current) => {
            const at = current.findIndex((file) => file.id === source.id);
            const next = [...current];
            next.splice(at < 0 ? next.length : at + 1, 0, { ...result, id, fresh: true });
            // keep the folder small: the oldest made-up file makes way for the newest
            const made = next.filter((file) => file.fresh);
            return made.length > MAX_RESULTS ? next.filter((file) => file.id !== made.sort(byAge)[0].id) : next;
        });
        return id;
    };

    const run = (file, kind, entry) => {
        const plan = planFor(file, entry, kind);
        timers.current.forEach(clearTimeout);
        timers.current = [];

        if (!plan.makeResult) {
            setJob({ state: "note", title: plan.title, detail: plan.detail });
            later(() => setJob(null), HUD_MS);
            return;
        }

        setJob({ state: "running", title: plan.title, detail: plan.detail, ms: plan.ms });
        later(() => {
            const saved = plan.makeResult(latest.current.files);
            const id = addResult(file, saved);
            setJob({ state: "done", title: plan.title, detail: plan.detail, saved: saved.name, id });
            later(() => setJob(null), HUD_MS);
        }, plan.ms);
    };

    const choose = (index) => {
        if (!wheel) return;
        const file = files.find((other) => other.id === wheel.fileId);
        const entry = entriesFor(file, wheel.kind)[index];
        if (!entry || entry.blocked) return;
        run(file, wheel.kind, entry);
        closeWheel();
    };

    const putDown = (ran) => {
        const ghost = ghostRef.current;
        const tile = gesture.current && tileOf(gesture.current.fileId);
        gesture.current = null;
        if (!ghost || !tile || still) {
            setLifted(null);
            return;
        }
        const box = tile.getBoundingClientRect();
        const from = ghost.style.transform;
        const to = ran
            ? `${from} scale(0.5)`
            : `translate(${box.left + box.width / 2}px, ${box.top + box.height / 2}px) translate(-50%, -50%)`;
        ghost.animate([{ transform: from, opacity: 1 }, { transform: to, opacity: ran ? 0 : 0.6 }], {
            duration: 170,
            easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
            fill: "forwards",
        }).onfinish = () => setLifted(null);
    };

    const placeGhost = () => {
        if (ghostRef.current) ghostRef.current.style.transform = ghostAt(pointer.current);
    };

    // Everything the window listeners need, always current, so they don't have to be re-attached mid-drag
    const latest = useRef();
    latest.current = { files, wheel, openWheel, closeWheel, choose, switchWheel, putDown, placeGhost, coarse };

    useLayoutEffect(placeGhost);

    useEffect(() => {
        const tray = trayRef.current;

        const onMove = (event) => {
            const press = gesture.current;
            if (!press || event.pointerId !== press.pointerId) return;
            pointer.current = { x: event.clientX, y: event.clientY };
            const now = latest.current;
            if (!press.moved) {
                if (Math.hypot(event.clientX - press.x, event.clientY - press.y) < DRAG_START_PX) return;
                press.moved = true;
                setLifted(press.fileId);
                // there's no key to tap on a phone, so the wheel comes straight up
                if (event.pointerType === "touch") now.openWheel(press.fileId, "drag", event.clientX, event.clientY);
            }
            now.placeGhost();
        };

        const finish = (cancelled) => {
            const press = gesture.current;
            removeListeners();
            if (!press) return;
            const now = latest.current;
            if (!press.moved) {
                gesture.current = null;
                if (!cancelled) now.openWheel(press.fileId, "click", press.x, press.y);
                return;
            }
            const open = now.wheel;
            if (open && !cancelled) {
                const file = now.files.find((other) => other.id === open.fileId);
                const entry = entriesFor(file, open.kind)[open.active];
                if (entry && !entry.blocked) {
                    now.choose(open.active);
                    now.putDown(true);
                    return;
                }
            }
            if (open) now.closeWheel();
            now.putDown(false);
        };

        const onUp = (event) => {
            if (gesture.current && event.pointerId === gesture.current.pointerId) finish(false);
        };
        const onCancel = (event) => {
            if (gesture.current && event.pointerId === gesture.current.pointerId) finish(true);
        };
        // the window losing focus mid-drag (pressing the real Win key, say) would strand the file on screen
        const onBlur = () => finish(true);

        const removeListeners = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onCancel);
            window.removeEventListener("blur", onBlur);
        };

        const onDown = (event) => {
            const tile = event.target.closest("[data-file]");
            if (!tile || event.button !== 0) return;
            if (gesture.current || latest.current.wheel) return;
            pointer.current = { x: event.clientX, y: event.clientY };
            gesture.current = {
                fileId: tile.dataset.file,
                pointerId: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                moved: false,
            };
            tile.setPointerCapture?.(event.pointerId);
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
            window.addEventListener("pointercancel", onCancel);
            window.addEventListener("blur", onBlur);
        };

        tray.addEventListener("pointerdown", onDown);
        return () => {
            tray.removeEventListener("pointerdown", onDown);
            removeListeners();
        };
    }, []);

    // Keys and scrolling, for as long as a file is in the air or a wheel is up
    const busy = Boolean(lifted || wheel);
    useEffect(() => {
        if (!busy) return undefined;

        const onKey = (event) => {
            const now = latest.current;
            const open = now.wheel;
            const dragging = gesture.current?.moved;

            if (event.key === "Escape") {
                event.preventDefault();
                if (open) now.closeWheel();
                if (dragging) now.putDown(false);
                return;
            }
            if (event.key === " " && dragging) {
                event.preventDefault();
                if (event.repeat) return;
                if (open) now.closeWheel();
                else now.openWheel(gesture.current.fileId, "drag", pointer.current.x, pointer.current.y);
                return;
            }
            if (!open || dragging) return;

            const file = now.files.find((other) => other.id === open.fileId);
            const total = entriesFor(file, open.kind).length;
            const step = (by) =>
                setWheel((current) =>
                    current && total ? { ...current, mode: "keys", active: (Math.max(current.active, by > 0 ? -1 : 0) + by + total) % total } : current,
                );

            if (event.key === "ArrowRight" || event.key === "ArrowDown") step(1);
            else if (event.key === "ArrowLeft" || event.key === "ArrowUp") step(-1);
            else if (event.key === "Enter" || event.key === " ") now.choose(open.active);
            else if (event.key === "Tab") now.switchWheel((open.kind + (event.shiftKey ? 2 : 1)) % 3);
            else return;
            event.preventDefault();
        };

        const onScroll = (event) => {
            const now = latest.current;
            if (!now.wheel) return;
            event.preventDefault();
            const time = performance.now();
            if (time - lastScroll.current < SCROLL_GAP_MS || !event.deltaY) return;
            lastScroll.current = time;
            now.switchWheel((now.wheel.kind + (event.deltaY > 0 ? 1 : 2)) % 3);
        };

        const onPoint = (event) => {
            pointer.current = { x: event.clientX, y: event.clientY };
            setWheel((current) => {
                if (!current) return current;
                const file = latest.current.files.find((other) => other.id === current.fileId);
                const active = optionAt(event.clientX, event.clientY, current, entriesFor(file, current.kind).length);
                if (active === current.active) return current;
                return { ...current, active };
            });
        };

        window.addEventListener("keydown", onKey);
        window.addEventListener("wheel", onScroll, { passive: false });
        window.addEventListener("pointermove", onPoint);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("wheel", onScroll);
            window.removeEventListener("pointermove", onPoint);
        };
    }, [busy]);

    const onTileKey = (event, file) => {
        if (gesture.current || wheel) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        const box = event.currentTarget.getBoundingClientRect();
        openWheel(file.id, "keys", box.left + box.width / 2, box.top + box.height / 2);
    };

    const showResult = useCallback((id) => {
        const tile = trayRef.current?.querySelector(`[data-file="${id}"]`);
        if (!tile) return;
        tile.scrollIntoView({ block: "center", behavior: "smooth" });
        tile.animate(
            [{ boxShadow: "0 0 0 0 rgba(200, 241, 53, 0.9)" }, { boxShadow: "0 0 0 10px rgba(200, 241, 53, 0)" }],
            { duration: 700, easing: "ease-out", iterations: 2 },
        );
    }, []);

    const reset = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setJob(null);
        setFiles(tauSamples);
    };

    const changed = files.length !== tauSamples.length;

    let hint;
    if (wheel?.mode === "drag") {
        hint = coarse ? (
            <>slide onto an option and let go</>
        ) : (
            <>
                <b>scroll</b> for more wheels · let go on an option · <kbd>esc</kbd> to cancel
            </>
        );
    } else if (wheel) {
        hint = coarse ? (
            <>tap an option · the dots switch wheels</>
        ) : (
            <>
                pick an option · <b>scroll</b> or <kbd>tab</kbd> for more wheels · <kbd>esc</kbd> to cancel
            </>
        );
    } else if (lifted) {
        hint = (
            <>
                now tap <kbd>space</kbd>
                <em> (in tau it&apos;s the win key)</em>
            </>
        );
    } else {
        hint = coarse ? <>drag a file, or tap one</> : <>drag a file, then tap <kbd>space</kbd></>;
    }

    return (
        <div className="tau-demo">
            <div className="tau-demo__bar mono">
                <span>demo files</span>
                {changed && (
                    <button type="button" onClick={reset}>
                        reset
                    </button>
                )}
            </div>

            <ul className="tau-demo__tray" ref={trayRef}>
                {files.map((file) => (
                    <li key={file.id}>
                        <div
                            className={`tau-file${file.id === lifted ? " tau-file--lifted" : ""}${file.fresh ? " tau-file--fresh" : ""}`}
                            data-file={file.id}
                            role="button"
                            tabIndex={0}
                            aria-haspopup="menu"
                            aria-label={`${file.name}, ${formatSize(file.size)}. Press enter to open the wheel.`}
                            onKeyDown={(event) => onTileKey(event, file)}
                        >
                            <FileArt file={file} />
                            <span className="tau-file__name">{file.name}</span>
                            <span className="tau-file__size mono">{formatSize(file.size)}</span>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="tau-demo__hint mono">{hint}</div>

            {createPortal(
                <>
                    {wheel && wheelFile && (
                        <Wheel
                            wheel={wheel}
                            file={wheelFile}
                            onChoose={choose}
                            onCancel={closeWheel}
                            onSwitch={switchWheel}
                        />
                    )}
                    {liftedFile && (
                        <div className="tau-ghost" ref={ghostRef} style={{ transform: ghostAt(pointer.current) }} aria-hidden="true">
                            <FileArt file={liftedFile} />
                            <span className="tau-file__name">{liftedFile.name}</span>
                        </div>
                    )}
                    <div className="tau-hud-slot" aria-live="polite">
                        {job && (
                            <div className={`tau-hud tau-hud--${job.state}`}>
                                <strong>{job.title}</strong>
                                {job.state === "running" && (
                                    <div className="tau-hud__bar">
                                        <i style={{ animationDuration: `${job.ms}ms` }} />
                                    </div>
                                )}
                                {job.detail && <p>{job.detail}</p>}
                                {job.state === "done" && (
                                    <button type="button" onClick={() => showResult(job.id)}>
                                        Saved {job.saved}. Click to show.
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </>,
                document.body,
            )}
        </div>
    );
};

const ghostAt = ({ x, y }) => `translate(${x}px, ${y}px) translate(-50%, -50%)`;
// result ids count up, so this puts the oldest first
const byAge = (a, b) => Number(a.id.split("-")[1]) - Number(b.id.split("-")[1]);

export default TauDemo;
