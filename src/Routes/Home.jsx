import { Link } from 'react-router-dom';
import './Home.css'

const Home = () => {
  return (
    <div className="home margin-left">
      <h1>👋 Welcome to Andy&apos;s Website!</h1>
      <h2>Hey, traveler! 🔎</h2>
      <h3><span className='accent-color'>&gt;</span> Where do you wanna go? 🗺️</h3>
      <ul className='sublinks'>
        <Link to='/about'><span className="secondary-color">&gt;</span> About me</Link>
        <Link to='/andybot'><span className="secondary-color">&gt;</span> AndyBot</Link>
        <Link to='/andyscript'><span className="secondary-color">&gt;</span> AndyScript</Link>
        <Link to='/games'><span className="secondary-color">&gt;</span> Games</Link>
      </ul>
    </div>
  )
}

export default Home