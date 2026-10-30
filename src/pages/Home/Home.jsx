import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import PropTypes from "prop-types";
import ActivityFeed from "../../Components/ActivityFeed/ActivityFeed";
import LiveStrip from "../../Components/LiveStrip/LiveStrip";
import ProjectBoard from "../../Components/ProjectBoard/ProjectBoard";
import RollingText from "../../Components/RollingText/RollingText";
import useActivity from "../../lib/useActivity";
import { presenceTone } from "../../lib/useSiteAccent";
import { awakeGuess, formatLocalTime, localHour, useNow } from "../../lib/time";
import "./Home.scss";

const rise = {
    hidden: { opacity: 0, y: 14 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
};

const GREETING = "hey, i'm andy.";
const TYPE_DELAY_MS = 180; // before the first letter
const TYPE_MS = 40; // per letter

// The greeting types itself out once, letter by letter, behind a caret. Returns how far it's got.
const useTyped = (text) => {
    const still = useReducedMotion();
    const [shown, setShown] = useState(still ? text.length : 0);

    useEffect(() => {
        if (shown >= text.length) return undefined;
        const timer = setTimeout(() => setShown((n) => n + 1), shown === 0 ? TYPE_DELAY_MS : TYPE_MS);
        return () => clearTimeout(timer);
    }, [shown, text.length]);

    return { typed: text.slice(0, shown), rest: text.slice(shown), done: shown >= text.length };
};

// What I'm up to, going by my PC when the site knows and by the clock when it doesn't.
// `tone` picks the dot: active (green), idle (yellow) or off (grey).
function presence(live, now) {
    const pc = live?.pc;
    const tone = presenceTone(live);
    if (pc?.online) {
        if (pc.status === "away") return { tone, text: "pc's on, but i stepped away" };
        return { tone, text: "at the pc right now", app: pc.app };
    }
    if (live?.music) return { tone, text: "away from the pc, music's on" };
    if (pc) {
        const hour = localHour(now);
        return { tone, text: hour >= 23 || hour < 8 ? "pc's off, probably asleep" : "away from the pc" };
    }
    return { tone, text: awakeGuess(now) };
}

const Presence = ({ live, now }) => {
    const { tone, text, app } = presence(live, now);
    return (
        <span className="presence">
            <i className={`presence__dot presence__dot--${tone}`} aria-hidden="true" />
            {text}
            {app && (
                <>
                    , in <b>{app}</b>
                </>
            )}
        </span>
    );
};

Presence.propTypes = {
    live: PropTypes.shape({
        pc: PropTypes.shape({ online: PropTypes.bool, status: PropTypes.string, app: PropTypes.string }),
        music: PropTypes.object,
    }),
    now: PropTypes.instanceOf(Date).isRequired,
};

const Home = () => {
    const now = useNow();
    const activity = useActivity();
    const { live } = useOutletContext();
    const greeting = useTyped(GREETING);

    return (
        <>
            <section className="wrap home-hero">
                <motion.div initial="hidden" animate="shown" transition={{ staggerChildren: 0.08 }}>
                    <motion.h1 variants={rise} aria-label={GREETING}>
                        <span className="prompt">&gt;</span>
                        {greeting.typed}
                        <span className={`typed-caret${greeting.done ? " typed-caret--done" : ""}`} />
                        {/* the untyped rest still takes its space, so nothing shifts as the letters appear */}
                        <span className="typed-rest">{greeting.rest}</span>
                    </motion.h1>
                    <motion.p variants={rise} className="home-hero__lead">
                        full-stack developer from argentina. i build tools, discord bots and small web games, and send
                        the odd pull request to open source projects i like.
                    </motion.p>
                    <motion.dl variants={rise} className="status">
                        <div>
                            <dt className="mono">currently</dt>
                            <dd>
                                <Presence live={live} now={now} />
                            </dd>
                        </div>
                        <div>
                            <dt className="mono">local time</dt>
                            <dd>
                                <RollingText text={formatLocalTime(now)} /> in argentina
                                <span className="status__note mono">utc-3</span>
                            </dd>
                        </div>
                    </motion.dl>
                </motion.div>

                <motion.div
                    className="home-hero__feed"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                >
                    <ActivityFeed status={activity.status} items={activity.items} now={now} />
                </motion.div>
            </section>

            <LiveStrip data={live} now={now.getTime()} />

            <ProjectBoard />
        </>
    );
};

export default Home;
