import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav>
      <Link to="/"><h2 className='color-gradient'>{"<"}Andy&apos;s Website{" />"}</h2></Link>
      <ul className='nav-links'>
        <Link to="/">🏠 Home</Link>
        <Link to="/about">📃 About Me</Link>
        <Link to="/andybot">🤖 AndyBot</Link>
        <Link to="/andyscript">💻 AndyScript</Link>
      </ul>
      {/* <button>Change Theme</button> */}
    </nav>
  )
}

export default Navbar