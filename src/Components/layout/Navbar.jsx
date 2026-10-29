import { Link, NavLink } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
    return (
        <header className="wrap navbar">
            <Link to="/" className="navbar__brand">
                <span className="prompt">&gt;</span> andy
            </Link>
            <nav className="navbar__links" aria-label="Main">
                <NavLink to="/" end>
                    home
                </NavLink>
                <NavLink to="/projects">projects</NavLink>
                <NavLink to="/games">games</NavLink>
            </nav>
        </header>
    );
};

export default Navbar;
