import { Link } from 'react-router-dom';
import './Home.css'
import { githubLogo, discordLogo, twitterLogo } from '../Components/common/ImportImages.jsx'

const Home = () => {
  return (
    <div className="home margin-left">
      <h1>👋 Welcome to Andy&apos;s Website!</h1> {/* &apos; means ' */}
      <h2>Hey, traveler!</h2>
      <h3><span className='accent-color'>&gt;</span> Where do you wanna go? 🗺️</h3>
      <ul className='sublinks'>
        <Link to='/about'>About me</Link>
        <Link to='/andybot'>AndyBot</Link>
        <Link to='/andyscript'>AndyScript</Link>
      </ul>
      <h3><span className='accent-color'>&gt;</span> Socials 📱</h3>
      <ul className='socials'>
        <a href="https://github.com/lancito01"><img src={githubLogo} alt="github logo"></img>Github: lancito01</a>
        <a href="https://discord.com/users/376153068821020675"><img src={discordLogo} alt="discord logo"></img>Discord: @lancito01</a>
        <a href="https://discord.gg/9vzATnaM9c"><img src={discordLogo} alt="discord logo"></img>Discord server</a>
        <a href="https://twitter.com/lancito01"><img src={twitterLogo} alt="twitter logo"></img>Twitter: @lancito01</a>
      </ul>
    </div>
  )
}

export default Home