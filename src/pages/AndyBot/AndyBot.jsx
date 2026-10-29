import showcase1 from "../../assets/showcase/showcase-1.webp";
import showcase2 from "../../assets/showcase/showcase-2.webp";
import showcase3 from "../../assets/showcase/showcase-3.webp";
import showcase4 from "../../assets/showcase/showcase-4.webp";
import "../page.scss";
import "./AndyBot.scss";

const showcases = [
    { image: showcase1, prompt: "AMG C63 speeding down the freeway at sunset." },
    {
        image: showcase2,
        prompt: "Several hundreds of years into the future, an abandoned city. Buildings decaying and falling. Nature and grass is taking over the abandoned city.",
    },
    {
        image: showcase3,
        prompt: "Realistic lush forest with beautiful colors and some fauna, god rays leaking through the leaves.",
    },
    {
        image: showcase4,
        prompt: "A black C63 speeding down a freeway at sunset (almost night time) with few police cars chasing it half a mile back.",
    },
];

const commands = [
    ["/help", null, "shows the list of commands"],
    ["/ping", null, "\"Pong!\" (shows the bot's latency)"],
    ["/imagine [prompt]", "perms", "generates an image based on the prompt"],
    ["/clear-history", "admin", "clears the messages the bot remembers in the current server or DM"],
    ["/lock-imagine [value]", "admin", "unlocks /imagine so anyone can use it"],
];

const AndyBot = () => {
    return (
        <div className="wrap page">
            <h1 className="page__title">
                <span className="prompt">&gt;</span>AndyBot
            </h1>
            <p className="page__intro">
                an ai discord bot that answers questions, chats and writes code using openai&apos;s gpt and google&apos;s
                gemini, and makes images with dall·e.
            </p>
            <p className="page__note">an older project. i haven&apos;t worked on it in a while, but here&apos;s what it does.</p>

            <section className="page__section">
                <h2>usage</h2>
                <p>
                    tag it anywhere in a message (in DMs, just send a message) or use one of its slash commands. it
                    lives in my{" "}
                    <a href="https://discord.gg/q7Rwp3uY2b" target="_blank" rel="noreferrer">
                        discord server
                    </a>
                    .
                </p>
            </section>

            <section className="page__section">
                <h2>commands</h2>
                <p>
                    <span className="andybot__tag mono">perms</span> needs special permissions,{" "}
                    <span className="andybot__tag mono">admin</span> is admins only.
                </p>
                <dl className="andybot__commands">
                    {commands.map(([command, access, description]) => (
                        <div key={command}>
                            <dt className="mono">
                                {command} {access && <span className="andybot__tag">{access}</span>}
                            </dt>
                            <dd>{description}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="page__section">
                <h2>images</h2>
                <p>a few things it made with /imagine:</p>
                <div className="andybot__gallery">
                    {showcases.map((showcase) => (
                        <figure key={showcase.prompt}>
                            <img src={showcase.image} alt={showcase.prompt} loading="lazy" width="768" height="768" />
                            <figcaption>{showcase.prompt}</figcaption>
                        </figure>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AndyBot;
