import Images from '../common/ImportFooterImages'
import './Footer.scss'

const Footer = () => {
  return (
    <footer className='ml-5 pt-5 pb-5' id='socials'>
      <h3 className=''><span className='accent-color'>&gt;</span> Socials 📱</h3>
      <ul className='socials flex flex-wrap items-center pt-2'>
        <a href="https://github.com/lancito01"><img src={Images.githubLogo} alt="github logo"></img>Github: lancito01</a>
        <a href="https://discord.com/users/376153068821020675"><img src={Images.discordLogo} alt="discord logo"></img>Discord: @lancito01</a>
        <a href="https://discord.gg/q7Rwp3uY2b"><img src={Images.discordLogo} alt="discord logo"></img>Discord server</a>
        <a href="https://twitter.com/lancito01"><img src={Images.twitterLogo} alt="twitter logo"></img>Twitter: @lancito01</a>
      </ul>
    </footer>
  )
}

export default Footer