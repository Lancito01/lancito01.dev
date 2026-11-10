import { Link, useOutletContext } from "react-router-dom";
import ObsPill from "../../Components/ObsPill/ObsPill";
import KickstepDemo from "../../Components/KickstepDemo/KickstepDemo";
import TauWheels from "../../Components/TauDemo/TauWheels";
import ThumpDemo from "../../Components/ThumpDemo/ThumpDemo";
import { andyScriptLinks, deltaLinks, kickstepLinks, obsHudLinks, tauLinks, thumpLinks } from "../../data/links";
import notificationsImage from "../../assets/obs/notifications.webp";
import deltaThemes from "../../assets/delta/themes.webp";
import "../page.scss";
import "./Projects.scss";

const Projects = () => {
    const { live } = useOutletContext();

    return (
        <div className="wrap page">
            <h1 className="page__title">
                <span className="prompt">&gt;</span>projects
            </h1>
            <p className="page__intro">
                the things i&apos;ve built that are worth a look. the rest lives on{" "}
                <a href="https://github.com/lancito01?tab=repositories" target="_blank" rel="noreferrer">
                    github
                </a>
                .
            </p>

            <ul className="page__rows">
                <li className="page__row">
                    <span className="page__meta mono">rust · windows · games</span>
                    <div>
                        <h2>Delta</h2>
                        <p>
                            a light, good-looking performance overlay for windows games: fps, frame times, gpu, cpu,
                            ram, disk and network, the way you want them. six themes you can copy and make your own,
                            numbers that don&apos;t jiggle as digits change, and one ~1 mb exe at about 0.1% cpu. it
                            never loads anything into your games, so anti-cheat leaves it alone.
                        </p>
                        <div className="projects__delta">
                            <img
                                src={deltaThemes}
                                alt="Delta's six built-in themes: minimal, futuristic, neon, terminal, hud and a one-line strip"
                                width="1600"
                                height="1086"
                                loading="lazy"
                            />
                        </div>
                        <div className="page__links">
                            <a href={deltaLinks.download} target="_blank" rel="noreferrer">
                                download
                            </a>
                            <a href={deltaLinks.github} target="_blank" rel="noreferrer">
                                source
                            </a>
                        </div>
                    </div>
                </li>
                <li className="page__row">
                    <span className="page__meta mono">rust · windows</span>
                    <div>
                        <h2>Tau</h2>
                        <p>
                            convert and work with files without opening anything. drag a file, tap the win key, and drop
                            it on the wheel that appears. everything runs on your pc, and the result lands next to the
                            original.
                        </p>
                        <div className="projects__tau">
                            <TauWheels />
                        </div>
                        <div className="page__links">
                            <Link to="/tau">read more</Link>
                            <a href={tauLinks.download} target="_blank" rel="noreferrer">
                                download
                            </a>
                            <a href={tauLinks.github} target="_blank" rel="noreferrer">
                                source
                            </a>
                        </div>
                    </div>
                </li>
                <li className="page__row">
                    <span className="page__meta mono">c# · windows · hue</span>
                    <div>
                        <h2>Thump</h2>
                        <p>
                            drums-first music sync for philips hue. kickstep, its own little neural network, picks out
                            every kick, clap and hi-hat as they play, and each light follows the drum you give it: a hard
                            flash on the kick, another on the backbeat, a shimmer with the hats. the colours come from
                            the album art of whatever&apos;s playing. below is a copy of its panel, using what i&apos;m
                            listening to right now.
                        </p>
                        <div className="projects__thump">
                            <ThumpDemo live={live} />
                        </div>
                        <div className="page__links">
                            <Link to="/thump">read more</Link>
                            <a href={thumpLinks.download} target="_blank" rel="noreferrer">
                                download
                            </a>
                            <a href={thumpLinks.github} target="_blank" rel="noreferrer">
                                source
                            </a>
                        </div>
                    </div>
                </li>
                <li className="page__row">
                    <span className="page__meta mono">neural net · python · c#</span>
                    <div>
                        <h2>Kickstep</h2>
                        <p>
                            the drum detector behind thump, released on its own. every 10.7 ms it says whether a kick, a
                            clap or snare or a hi-hat just started, about 50 ms after the hit and with no lookahead, on
                            well under 1% of a cpu core. it hears the last ~4 seconds, so it judges each hit by where it
                            sits in the groove as well as by its sound. it&apos;s tuned for electronic music, and free to
                            use (mit) in visualisers, lighting, games or anything else.
                        </p>
                        <div className="projects__kickstep">
                            <KickstepDemo />
                            <p className="mono">
                                what it hears in the same loop as thump&apos;s panel. each hit is as tall as kickstep is
                                sure; under the dashed line it stays grey, like a light that stays dark.
                            </p>
                        </div>
                        <div className="page__links">
                            <a href={kickstepLinks.github} target="_blank" rel="noreferrer">
                                source
                            </a>
                            <a href={kickstepLinks.weights} target="_blank" rel="noreferrer">
                                weights
                            </a>
                        </div>
                    </div>
                </li>
                <li className="page__row">
                    <span className="page__meta mono">c# · windows</span>
                    <div>
                        <h2>obs-hud</h2>
                        <p>
                            a small always-on-top pill that shows whether obs is recording or buffering, plus a pop-up
                            and a sound for every event: recording started, clip saved, replay buffer on, lost
                            connection. it&apos;s click-through, hidden from captures and uses no cpu while idle.
                        </p>
                        <div className="projects__obs">
                            <ObsPill />
                            <img
                                src={notificationsImage}
                                alt="obs-hud notifications: recording started, clip saved, recording paused, recording saved, replay buffer on, lost connection"
                                width="1094"
                                height="442"
                                loading="lazy"
                            />
                        </div>
                        <div className="page__links">
                            <Link to="/obs-hud">read more</Link>
                            <a href={obsHudLinks.download} target="_blank" rel="noreferrer">
                                download
                            </a>
                            <a href={obsHudLinks.github} target="_blank" rel="noreferrer">
                                source
                            </a>
                        </div>
                    </div>
                </li>

                <li className="page__row">
                    <span className="page__meta mono">lua · gta v</span>
                    <div>
                        <h2>AndyScript</h2>
                        <p>
                            my open source lua script for stand, the gta v mod menu. shortcuts, chaos mode, a spooner
                            and more, and it keeps itself up to date.
                        </p>
                        <div className="page__links">
                            <Link to="/andyscript">read more</Link>
                            <a href={andyScriptLinks.github} target="_blank" rel="noreferrer">
                                github
                            </a>
                            <a href={andyScriptLinks.download}>download</a>
                        </div>
                    </div>
                </li>

                <li className="page__row">
                    <span className="page__meta mono">browser game</span>
                    <div>
                        <h2>HueGuessr</h2>
                        <p>you get a colour and type the hex code you think it is. sounds easy, it isn&apos;t.</p>
                        <div className="page__links">
                            <Link to="/games/hueguessr">play it</Link>
                        </div>
                    </div>
                </li>

                <li className="page__row">
                    <span className="page__meta mono">discord bot · older</span>
                    <div>
                        <h2>AndyBot</h2>
                        <p>
                            an ai discord bot that chatted using gpt and gemini and made images with dall·e. i
                            haven&apos;t worked on it in a while.
                        </p>
                        <div className="page__links">
                            <Link to="/andybot">read more</Link>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Projects;
