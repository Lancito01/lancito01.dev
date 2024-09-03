import "./Proyects.scss";

const Proyects = () => {
    return (
        <div className="proyects-wrapper m-auto pt-4">
            <h1 className="text-2xl mx-auto w-fit">Coding Projects</h1>
            <div className="flex justify-center flex-wrap">
                <div className="project w-60 sm:w-96 p-4 m-4 rounded-md">
                    <a
                        className="text-xl project-title mx-auto w-fit block"
                        href="/andyscript"
                    >
                        AndyScript
                    </a>
                    <p className="pt-2 text-sm text-justify">
                        AndyScript is my open-source Lua script for Stand, the
                        Grand Theft Auto V mod menu that enhances your game
                        experience.
                    </p>
                    <div className="flex justify-evenly">
                        <a
                            className="text-sm"
                            href="https://github.com/lancito01/andyscript"
                        >
                            <i className="fa-brands fa-github fa-lg mt-6 mb-2" />{" "}
                            Github
                        </a>
                        <a
                            className="text-sm"
                            href="https://github.com/Lancito01/AndyScript/archive/refs/heads/main.zip"
                        >
                            <i className="fa-solid fa-download fa-lg mt-6 mb-2" />{" "}
                            Download
                        </a>
                    </div>
                </div>
                <div className="project w-60 sm:w-96 p-4 m-4 rounded-md">
                    <a
                        className="text-xl project-title mx-auto w-fit block"
                        href="/andybot"
                    >
                        AndyBot
                    </a>
                    <p className="pt-2 text-sm text-justify">
                        AndyBot is an advanced AI-powered Discord bot featuring
                        OpenAI&apos;s GPT and Google&apos;s Gemini APIs for
                        dynamic and intelligent responses.
                    </p>
                    <div className="flex justify-evenly">
                        <a className="text-sm" href="/andybot">
                            <i className="fa-solid fa-circle-info fa-lg mt-6 mb-2" />{" "}
                            Information
                        </a>
                    </div>
                </div>
            </div>
            <hr />
            <a className="text-2xl mx-auto w-fit block underline" href="/games">
                Web Games
            </a>
            <div className="flex justify-center flex-wrap">
                <div className="project w-60 sm:w-96 p-4 m-4 rounded-md">
                    <a
                        className="text-xl project-title mx-auto w-fit block"
                        href="/games/hueguessr"
                    >
                        HueGuessr
                    </a>
                    <p className="pt-2 text-sm text-justify">
                        HueGuessr is a fun game where you&apos;ll be shown a
                        color and its corresponding Hex value, and you&apos;re
                        supposed to approximate a Hex value to that color!
                    </p>
                    <div className="flex justify-evenly">
                        <a className="text-sm" href="/games/hueguessr">
                            <i className="fa-solid fa-play fa-lg mt-6 mb-2" />{" "}
                            Play
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Proyects;
