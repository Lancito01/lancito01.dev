import { motion } from "motion/react";
import PropTypes from "prop-types";
import ActivityFeed from "../../Components/ActivityFeed/ActivityFeed";
import LiveStrip from "../../Components/LiveStrip/LiveStrip";
import ProjectBoard from "../../Components/ProjectBoard/ProjectBoard";
import useActivity, { activityItemShape, activityStatus } from "../../lib/useActivity";
import useLiveStats from "../../lib/useLiveStats";
import { awakeGuess, formatLocalTime, localHour, timeAgo, useNow } from "../../lib/time";
import { socials } from "../../data/links";
import "./Home.scss";

const QUIET_AFTER = 48 * 60 * 60 * 1000;

const rise = {
    hidden: { opacity: 0, y: 14 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
};

const Currently = ({ status, current, now }) => {
    if (status === "loading") return <span className="status__note">checking github…</span>;
    if (status === "error" || !current) return <span className="status__note">couldn&apos;t reach github right now</span>;

    const ago = `${timeAgo(current.at, now)} ago`;
    if (now - new Date(current.at) > QUIET_AFTER) {
        return (
            <>
                quiet lately. last seen: {current.past}
                {current.repo && (
                    <>
                        {" "}
                        in <b>{current.repo}</b>
                    </>
                )}
                <span className="status__note mono">{ago}</span>
            </>
        );
    }

    return (
        <>
            {current.present} {current.repo && <b>{current.repo}</b>}
            <span className="status__note mono">{ago}</span>
        </>
    );
};

Currently.propTypes = {
    status: activityStatus.isRequired,
    current: activityItemShape,
    now: PropTypes.instanceOf(Date).isRequired,
};

// Goes by whether my PC is on when the site knows, and by the clock when it doesn't
function presence(live, now) {
    const pc = live?.pc;
    if (pc?.online) return pc.status === "away" ? "pc's on, but i stepped away" : "at the pc right now";
    if (live?.music) return "away from the pc, music's on";
    if (pc) {
        const hour = localHour(now);
        return hour >= 23 || hour < 8 ? "pc's off, probably asleep" : "away from the pc";
    }
    return awakeGuess(now);
}

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
                                <Currently status={activity.status} current={activity.current} now={now} />
                            </dd>
                        </div>
                        <div>
                            <dt className="mono">local time</dt>
                            <dd>
                                {formatLocalTime(now)} in argentina
                                <span className="status__note mono">utc-3, {presence(live, now)}</span>
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
