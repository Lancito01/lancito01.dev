import { Link } from 'react-router-dom';
import './Home.scss'

const Home = () => {
  return (
    <div className="home margin-left pt-4 ml-5">
      <h1 className='text-2xl'>👋 Welcome to Andy&apos;s Website!</h1>
      <h2 className='text-xl pt-2'>Hey, traveler! 🔎</h2>
      <h3 className='text-l pt-2'><span className='accent-color'>&gt;</span> Where do you wanna go? 🗺️</h3>
      <ul className='flex flex-col ml-5 pt-2'>
        <Link to='/about'><span className="secondary-color">&gt;</span> About me</Link>
        <Link to='/andybot'><span className="secondary-color">&gt;</span> AndyBot</Link>
        <Link to='/andyscript'><span className="secondary-color">&gt;</span> AndyScript</Link>
        <Link to='/games'><span className="secondary-color">&gt;</span> Games</Link>
      </ul>
    </div>
  )
}

export default Home