import { Link } from "react-router-dom"

const Games = () => {
  return (
    <div className="margin-left games-wrapper">
        <h1>Games</h1>
        <p>The following are a list of browser games I made. Have fun!</p>
        <ul>
            <li><Link to='/games/hueguessr'>HueGuessr</Link></li>
        </ul>
    </div>
  )
}

export default Games