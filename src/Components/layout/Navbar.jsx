import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav>
      <Link to="/"><div className='color-gradient'><h2>{"<"}Andy&apos;s Website{" />"}</h2></div></Link>
      <ul className='nav-links'>
        <Link className='padding-background-effect' to="/">🏠 Home</Link>
        <Link className='padding-background-effect' to="/about">📃 About Me</Link>
        <Link className='padding-background-effect' to="/andybot">🤖 AndyBot</Link>
        <Link className='padding-background-effect' to="/andyscript">💻 AndyScript</Link>
      </ul>
      {/* <button>Change Theme</button> */}
    </nav>
  )
}

export default Navbar