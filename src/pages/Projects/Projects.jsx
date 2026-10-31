import { Link, useOutletContext } from "react-router-dom";
import ObsPill from "../../Components/ObsPill/ObsPill";
import ThumpDemo from "../../Components/ThumpDemo/ThumpDemo";
import { andyScriptLinks, obsHudLinks, thumpLinks } from "../../data/links";
import notificationsImage from "../../assets/obs/notifications.webp";
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
                    <span className="page__meta mono">c# · windows · hue</span>
                    <div>
                        <h2>Thump</h2>
                        <p>
                            music sync for philips hue that cares about the kick and the sub instead of the hats. it
                            learns each track&apos;s kick as it plays, follows tempo changes, and colours every light from
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
