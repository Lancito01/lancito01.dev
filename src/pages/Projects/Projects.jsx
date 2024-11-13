import "./Projects.scss";
import Card from "../../Components/Card/Card.jsx";

const Projects = () => {
    return (
        <div className="projects-wrapper m-auto pt-4">
            <h1 className="text-2xl mx-auto w-fit">Coding Projects</h1>
            <div className="flex justify-center flex-wrap">
                <Card
                    title={"AndyBot"}
                    description={"AndyBot is an advanced AI-powered Discord bot featuring OpenAI's GPT and Google's Gemini APIs for dynamic and intelligent responses."}
                    link={"andybot"}
                    information={"/andybot"}
                />
                <Card
                    title={"AndyScript"}
                    description={"AndyScript is my open-source Lua script for Stand, the Grand Theft Auto V mod menu that enhances your game experience."}
                    link={"andyscript"}
                    github={"https://github.com/lancito01/andyscript"}
                    download={"https://github.com/Lancito01/AndyScript/archive/refs/heads/main.zip"}
                />
            </div>
            <hr />
            <a className="text-2xl mx-auto w-fit block underline" href="/games">
                Web Games
            </a>
            <div className="flex justify-center flex-wrap">
                <Card
                    title={"HueGuessr"}
                    link={"games/hueguessr"}
                    description={"HueGuessr is a fun game where you'll be shown a color and its corresponding Hex value, and you're supposed to approximate a Hex value to that color!"}
                    playLink={"games/hueguessr"}
                />
            </div>
        </div>
    );
};

export default Projects;
