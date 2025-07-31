import Showcases from '../../Components/utils/ImportAndyBotShowcaseImages'
import './AndyBot.scss'

const AndyBot = () => {
    return (
        <div className="andybot-wrapper w-full flex flex-col px-4">
            <h1 className='text-2xl w-fit m-auto'><span className="accent-color">&gt;</span> AndyBot 🤖</h1>
            <h3 className='text-l w-fit m-auto'><span className="accent-color">&gt;</span> About AndyBot 🔎</h3>
            <ul className='andybot-desc m-auto'>
                <p className='text-descs text-justify'>AndyBot is an advanced AI-powered Discord bot featuring OpenAI&apos;s GPT API for dynamic and intelligent responses. With its vast knowledge and natural language processing abilities, AndyBot is here to assist you with inquiries, provide information, and engage in conversations. AndyBot can also generate creative content, such as stories and code snippets. Consider AndyBot your digital companion, ready to make your online journey smoother and more enjoyable.</p>
                <br />
                <p className='text-center'>For more information, please contact me on any of my <a href="#socials">socials</a> below.</p>
            </ul>
            <h3 className='text-l w-fit m-auto'><span className="accent-color">&gt;</span> Usage 📰</h3>
            <p className='text-descs w-fit m-auto text-justify'>To interact with AndyBot, simply tag it anywhere in your message (or if you&apos;re in DMs, sending a message will suffice) or use any of its built-in slash commands. Feel free to join my Discord server found in my <a href="#socials">socials</a> below to interact with AndyBot!</p>
            <h3 className='text-l w-fit m-auto'><span className="accent-color">&gt;</span> Images 🖼️</h3>
            <ul className=''>
                <p className='w-fit m-auto'>AndyBot is capable of generating images with the DALL-E API through its bult-in slash command /imagine.</p>
                <p className='w-fit m-auto'>Here are some examples of what its capable of:</p>
                <div className="flex flex-wrap justify-center w-fit m-auto">
                    {Showcases.map((showcase, index) => {
                        return (<div key={index} className='showcase-entry flex flex-col px-2'>
                            <img src={showcase.image} alt="AndyBot showcase image" />
                            <small>Prompt: {showcase.prompt}</small>
                        </div>)
                    })}
                </div>
            </ul>
            <h3 className='text-l w-fit m-auto'><span className="accent-color">&gt;</span> Commands ⌨️</h3>
            <p className='text-descs w-fit m-auto text-center'>The following is a list of some of AndyBot&apos;s commands. The ones marked with a 🔓 require special permissions to use them and the ones marked with a 🔒 are only available to admins.</p>
            <ul className='text-descs w-fit m-auto text-center'>
                <p><span className='font-black'>/help</span> - Shows this message</p>
                <p><span className='font-black'>/ping</span> - &quot;Pong!&quot; (shows the bot&apos;s latency)</p>
                <p><span className='font-black'>/imagine [prompt]</span> 🔓 - Generates an image based on the prompt</p>
                <p><span className='font-black'>/clear-history</span> 🔒 - Clears the history of messages sent to the bot in the current server/DM</p>
                <p><span className='font-black'>/lock-imagine [value]</span> 🔒 - Unlocks the imagine command so anyone can use it</p>
            </ul>
        </div>
    )
}

export default AndyBot