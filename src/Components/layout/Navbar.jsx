import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav>
        <Link to="/">🏠 Home</Link>
        <Link to="/about">📃 About Me</Link>
        <Link to="/andybot">🤖 AndyBot</Link>
        <Link to="/andyscript">💻 AndyScript</Link>
    </nav>
  )
}

export default Navbar