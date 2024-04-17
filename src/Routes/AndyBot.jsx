import Showcases from '../Components/common/ImportAndyBotShowcaseImages'
import './AndyBot.css'

const AndyBot = () => {
  return (
    <div className="margin-left andybot-div">
      <h1><span className="accent-color">&gt;</span> AndyBot 🤖</h1>
      <h3><span className="accent-color">&gt;</span> About AndyBot 🔎</h3>
      <ul>
        <p>AndyBot is an advanced AI-powered Discord bot featuring Google&apos;s Gemini API for dynamic and intelligent responses.</p>
        <p>With its vast knowledge and natural language processing abilities, AndyBot is here to assist you with inquiries, provide information, and engage in conversations.</p>
        <p>AndyBot can also generate creative content, such as stories and code snippets. Consider AndyBot your digital companion, ready to make your online journey smoother and more enjoyable.</p>
        <br />
        <p>For more information, please contact me on any of my <a href="#socials">socials</a> below.</p>
      </ul>
      <h3><span className="accent-color">&gt;</span> Usage 📰</h3>
      <ul>
        <p>To interact with AndyBot, simply tag it anywhere in your message (or if you&apos;re in DMs, sending a message will suffice) or use any of its built-in slash commands. Feel free to join my Discord server found in my <a href="#socials">socials</a> below to interact with AndyBot!</p>
      </ul>
      <h3><span className="accent-color">&gt;</span> Images 🖼️</h3>
      <ul>
        <p>AndyBot is capable of generating images with the DALL-E API through its bult-in slash command /imagine.</p>
        <p>Here are some examples of what its capable of:</p>
        <div className="andybot-images">
          {Showcases.map((showcase, index) => {
            return (
              <div key={index} className='showcase-entry'>
                <img src={showcase.image} alt="" />
                <small>Prompt: {showcase.prompt}</small>
              </div>
            )
          })}
        </div>
      </ul>
      <h3><span className="accent-color">&gt;</span> Commands ⌨️</h3>
      <p className='padding-left'>The following is a list of all of AndyBot&apos;s commands. The ones marked with a 🔓 require special permissions to use them and the ones marked with a 🔒 are only available to admins.</p>
      <ul className='padding-left-large'>
        <p>/help - Shows this message</p>
        <p>/ping - &quot;Pong!&quot; (shows the bot&apos;s latency)</p>
        <p>/imagine [prompt] 🔓 - Generates an image based on the prompt</p>
        <p>/clear-history 🔒 - Clears the history of messages sent to the bot in the current server/DM</p>
        <p>/lock-imagine [value] 🔒 - Unlocks the imagine command so anyone can use it</p>
        <p>/joinvc - Joins the voice channel you&apos;re in</p>
        <p>/play [youtube link] - Plays the audio from the YouTube video</p>
        <p>/leavevc - Leaves the voice channel</p>
      </ul>
    </div>
  )
}

export default AndyBot