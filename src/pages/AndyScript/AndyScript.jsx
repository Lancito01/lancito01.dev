const AndyScript = () => {
    const andyScriptDownloadLink = 'https://github.com/Lancito01/AndyScript/archive/refs/heads/main.zip'
    const andyScriptGithubLink = 'https://github.com/Lancito01/AndyScript';

    return (
        <div className="andyscript ml-5 pt-4">
            <h1 className="text-2xl"><span className="accent-color">&gt;</span> AndyScript 💻</h1>
            <h3 className="text-l pt-2"><span className="accent-color">&gt;</span> What is it? ❓</h3>
            <ul className="ml-5 pt-2">
                <p>AndyScript is my open-source Lua script for <a href="https://stand.gg">Stand</a>, the Grand Theft Auto V mod menu that enhances your game experience.</p>
                <p>For any questions or suggestions, please join my Discord server listed in my <a href="#socials">socials</a> below.</p>
            </ul>
            <h3 className="text-l pt-2"><span className="accent-color">&gt;</span> Features 📃</h3>
            <ul className="ml-10 pt-2 list-disc">
                <li>Turn off radio automatically</li>
                <li>Andy&apos;s Shortcuts (create aliases for other commands, i.e. &quot;dv&quot; = &quot;deletevehicle&quot;)</li>
                <li>Give every weapon after joining a session</li>
                <li>Heal ped to max health (only health, no armor)</li>
                <li>Spawn peds inside player vehicle</li>
                <li>Chaos mode</li>
                <li>Andy&apos;s Spooner</li>
                <li>... and more!</li>
            </ul>
            <h3 className="text-l pt-2"><span className="accent-color">&gt;</span> How can I try it? 💡</h3>
            <ul className="ml-5 pt-2">
                <p>It&apos;s easy! You can <a href={andyScriptDownloadLink}>download</a> the latest version of AndyScript from my <a href={andyScriptGithubLink}>GitHub repo</a>.</p>
                <p>From there, just drag it into Stand&apos;s Lua Scripts folder and you&apos;re good to go!</p>
                <p>AndyScript will automatically update, so there&apos;s no need to re-download it. </p>
            </ul>
            <h3 className="text-l pt-2"><span className="accent-color">&gt;</span> How can I contribute? 🤝</h3>
            <ul className="ml-5 pt-2">
                <p>Firstly, joining my Discord server is greatly appreciated. There, you can suggest new features or report bugs, which is of great help to me! </p>
                <p>Money-wise, donations are always welcome, but not necessary! For more information about this, message me privately on any of my <a href="#socials">socials</a> below.</p>
            </ul>
        </div>
    )
}

export default AndyScript