import { andyScriptLinks } from "../../data/links";
import "../page.scss";

const AndyScript = () => {
    return (
        <div className="wrap page">
            <h1 className="page__title">
                <span className="prompt">&gt;</span>AndyScript
            </h1>
            <p className="page__intro">
                my open source lua script for{" "}
                <a href="https://stand.gg" target="_blank" rel="noreferrer">
                    stand
                </a>
                , the grand theft auto v mod menu.
            </p>

            <section className="page__section">
                <h2>features</h2>
                <ul>
                    <li>turns the radio off automatically</li>
                    <li>andy&apos;s shortcuts: aliases for other commands, e.g. &quot;dv&quot; for &quot;deletevehicle&quot;</li>
                    <li>gives you every weapon after joining a session</li>
                    <li>heals your ped to max health (health only, no armour)</li>
                    <li>spawns peds inside a player&apos;s vehicle</li>
                    <li>chaos mode</li>
                    <li>andy&apos;s spooner</li>
                    <li>and more</li>
                </ul>
            </section>

            <section className="page__section">
                <h2>how to try it</h2>
                <p>
                    <a href={andyScriptLinks.download}>download the latest version</a> from the{" "}
                    <a href={andyScriptLinks.github} target="_blank" rel="noreferrer">
                        github repo
                    </a>
                    , then drag it into stand&apos;s lua scripts folder and you&apos;re good to go.
                </p>
                <p>it updates itself, so there&apos;s no need to download it again.</p>
            </section>

            <section className="page__section">
                <h2>how to help</h2>
                <p>
                    join my{" "}
                    <a href="https://discord.gg/q7Rwp3uY2b" target="_blank" rel="noreferrer">
                        discord server
                    </a>{" "}
                    to suggest features or report bugs, that helps a lot. donations are welcome but never needed,
                    message me on any of the links below if you want to.
                </p>
            </section>
        </div>
    );
};

export default AndyScript;
