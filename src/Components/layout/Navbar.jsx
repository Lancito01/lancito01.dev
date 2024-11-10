import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="flex items-center justify-center w-full m-auto h-20">
            <div className="padding-background-effect rounded-md md:mx-4">
                <Link
                    to="/"
                    className={`${
                        location.pathname == "/" ? "selected" : ""
                    } text-nowrap`}
                >
                    <i className="fa-regular fa-address-card" /> About
                </Link>
            </div>
            <div className="padding-background-effect rounded-md md:mx-4">
                <Link
                    to="/projects"
                    className={`${
                        location.pathname.includes("projects") ? "selected" : ""
                    } text-nowrap`}
                >
                    <i className="fa-regular fa-clipboard" /> Projects
                </Link>
            </div>
            <div className="padding-background-effect rounded-md md:mx-4">
                <Link
                    to="/games"
                    className={`${
                        location.pathname.includes("games") ? "selected" : ""
                    } text-nowrap`}
                >
                    <i className="fa-solid fa-gamepad" /> Games
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;