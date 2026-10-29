import { Link } from "react-router-dom";
import "../page.scss";
import "./Games.scss";

const Games = () => {
    return (
        <div className="wrap page">
            <h1 className="page__title">
                <span className="prompt">&gt;</span>games
            </h1>
            <p className="page__intro">small browser games i made. have fun!</p>

            <ul className="page__rows">
                <li className="page__row">
                    <Link to="/games/hueguessr" className="games__thumb" aria-hidden="true" tabIndex={-1}>
                        <i style={{ background: "#3fb6e8" }} />
                        <i style={{ background: "#f17b0b" }} />
                        <i style={{ background: "#85ee14" }} />
                        <i style={{ background: "#e9e7e2" }} />
                    </Link>
                    <div>
                        <h2>HueGuessr</h2>
                        <p>you get a colour and type the hex code you think it is. how close can you get?</p>
                        <div className="page__links">
                            <Link to="/games/hueguessr">play</Link>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Games;
