import { motion } from "motion/react";
import PropTypes from "prop-types";
import ActivityFeed from "../../Components/ActivityFeed/ActivityFeed";
import LiveStrip from "../../Components/LiveStrip/LiveStrip";
import ProjectBoard from "../../Components/ProjectBoard/ProjectBoard";
import useActivity from "../../lib/useActivity";
import useLiveStats from "../../lib/useLiveStats";
import { awakeGuess, formatLocalTime, localHour, useNow } from "../../lib/time";
import { socials } from "../../data/links";
import "./Home.scss";

const rise = {
    hidden: { opacity: 0, y: 14 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
};

// What I'm up to, going by my PC when the site knows and by the clock when it doesn't.
// `tone` picks the dot: active (green), idle (yellow) or off (grey).
function presence(live, now) {
    const pc = live?.pc;
    if (pc?.online) {
        if (pc.status === "away") return { tone: "idle", text: "pc's on, but i stepped away" };
        return { tone: "active", text: "at the pc right now", app: pc.app };
    }
    if (live?.music) return { tone: "idle", text: "away from the pc, music's on" };
    if (pc) {
        const hour = localHour(now);
        return { tone: "off", text: hour >= 23 || hour < 8 ? "pc's off, probably asleep" : "away from the pc" };
    }
    return { tone: "off", text: awakeGuess(now) };
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
    const live = useLiveStats();

    return (
        <>
            <section className="wrap home-hero">
                <motion.div initial="hidden" animate="shown" transition={{ staggerChildren: 0.08 }}>
                    <motion.h1 variants={rise}>
                        <span className="prompt">&gt;</span>hey, i&apos;m andy.
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
                                <span className="status__clock">{formatLocalTime(now)}</span> in argentina
                                <span className="status__note mono">utc-3</span>
                            </dd>
                        </div>
                        <div>
                            <dt className="mono">elsewhere</dt>
                            <dd className="status__links">
                                {socials.slice(0, 4).map((social) => (
                                    <a key={social.name} href={social.url} target="_blank" rel="noreferrer">
                                        {social.name}
                                    </a>
                                ))}
                            </dd>
                        </div>
                    </motion.dl>
                </motion.div>

                <motion.div
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
