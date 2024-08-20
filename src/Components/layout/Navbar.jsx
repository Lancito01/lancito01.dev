import { Link } from 'react-router-dom'
import './Navbar.scss'

const Navbar = () => {
  return (
    <nav className='flex items-center w-full m-auto h-14'>
      <Link to="/" className='text-xl px-3'><div className='color-gradient'><h2>{"<"}Andy&apos;s Website{" />"}</h2></div></Link>
      <ul className='nav-links p-0'>
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