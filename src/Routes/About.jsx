import { Link } from "react-router-dom"
import './About.css'
import standLogo from '../assets/stand logo.gif'

const About = () => {
  function getAge() {
    const today = new Date();
    const birthDate = new Date('2004-01-08');
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <div className="margin-left about-div">
      <h1>👋 Hi, there! My name&apos;s Andy.</h1>
      <h2><span className="accent-color">&gt;</span> I am a beginner full-stack programmer, looking to improve.</h2>
      <h3><span className="accent-color">&gt;</span> A little about me</h3>
      <ul>
        <p><span className="secondary-color">&gt;</span> My name is Andy, and I&apos;m a {getAge()}-year-old guy from Argentina.</p>
        <p><span className="secondary-color">&gt;</span> I&apos;m a beginner full-stack programmer trying to improve and broaden my skills.</p>
      </ul>
      <h3><span className="accent-color">&gt;</span> Programming languages I know</h3>
      <ul className="prog-lang-list">
        <p><span className="secondary-color">&gt;</span> JavaScript</p>
        <p><span className="secondary-color">&gt;</span> Lua</p>
        <p><span className="secondary-color">&gt;</span> Python</p>
        <p><span className="secondary-color">&gt;</span> Java</p>
        <p><span className="secondary-color">&gt;</span> HTML</p>
        <p><span className="secondary-color">&gt;</span> C++</p>
      </ul>
      <h3><span className="accent-color">&gt;</span> Proyects</h3>
      <ul className="proy-list">
        <p><span className="secondary-color">&gt;</span> <a href="https://github.com/Lancito01/andyscript">AndyScript</a> for <a href="https://stand.gg">Stand</a> mod menu</p>
        <p><span className="secondary-color">&gt;</span> <a href="https://github.com/Lancito01/lancito01.dev">This very website!</a></p>
        <p><span className="secondary-color">&gt;</span> <Link to="/andybot">AndyBot</Link></p>
      </ul>
      <a href="https://stand.gg"><h3><span className="accent-color">&gt;</span> Stand <img id="stand-logo" src={standLogo}></img></h3></a>
      <ul className="stand-desc">
        <p><span className="secondary-color">&gt;</span> Currently staff & Spanish translator at <a href="https://stand.gg">Stand</a>, the Grand Theft Auto V mod menu that enhances your game experience.</p>
      </ul>
    </div>
  )
}

export default About