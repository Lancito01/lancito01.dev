import { Link } from "react-router-dom"
import standLogo from '../../assets/stand logo.gif'
import './About.scss'

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
        <div className="about-div ml-5 pt-4">
            <h1 className="text-2xl"><span className="accent-color">&gt;</span> Hi, there! My name&apos;s Andy. 👋</h1>
            <h2 className="text-xl pt-2"><span className="accent-color">&gt;</span> I am a beginner full-stack programmer, looking to improve.</h2>
            <h3 className="text-l pt-2"><span className="accent-color">&gt;</span> A little about me</h3>
            <ul className="ml-5 pt-2">
                <p><span className="secondary-color">&gt;</span> My name is Andy, and I&apos;m a {getAge()}-year-old guy from Argentina.</p>
                <p><span className="secondary-color">&gt;</span> I&apos;m a beginner full-stack programmer trying to improve and broaden my skills.</p>
            </ul>
            <h3 className="pt-2"><span className="accent-color">&gt;</span> Programming languages I know</h3>
            <ul className="flex flex-wrap ml-5 pt-2">
                <p><span className="secondary-color">&gt;</span> JavaScript</p>
                <p className="pl-3"><span className="secondary-color">&gt;</span> Lua</p>
                <p className="pl-3"><span className="secondary-color">&gt;</span> Python</p>
                <p className="pl-3"><span className="secondary-color">&gt;</span> Java</p>
                <p className="pl-3"><span className="secondary-color">&gt;</span> HTML</p>
                <p className="pl-3"><span className="secondary-color">&gt;</span> C++</p>
            </ul>
            <h3 className=" pt-2"><span className="accent-color">&gt;</span> Projects</h3>
            <ul className="flex flex-wrap ml-5 pt-2">
                <p><span className="secondary-color">&gt;</span> <a href="https://github.com/Lancito01/andyscript">AndyScript</a> for <a href="https://stand.gg">Stand</a> mod menu</p>
                <p className="pl-3"><span className="secondary-color">&gt;</span> <a href="https://github.com/Lancito01/lancito01.dev">This very website!</a></p>
                <p className="pl-3"><span className="secondary-color">&gt;</span> <Link to="/andybot">AndyBot</Link></p>
                <p className="pl-3"><span className="secondary-color">&gt;</span> <Link to="/games">Games</Link></p>
            </ul>
            <h3 className=" pt-2" style={{ height: "32px" }}><a href="https://stand.gg"><span className="accent-color">&gt;</span> Stand <img id="stand-logo" src={standLogo}></img></a></h3>
            <ul className="stand-desc ml-5 pt-2">
                <p><span className="secondary-color">&gt;</span> Currently staff & Spanish translator at <a href="https://stand.gg">Stand</a>, the Grand Theft Auto V mod menu that enhances your game experience.</p>
            </ul>
        </div >
    )
}

export default About