import { Link } from "react-router-dom";

const Games = () => {
  return (
    <div className="games-wrapper m-auto">
      <h1 className="text-2xl pt-4 w-fit mx-auto">Games</h1>
      <p className="pt-2">The following are a list of browser games I made. Have fun!</p>
      <ul className="flex pt-2">
        <li><Link to='/games/hueguessr'><span className="secondary-color">&gt;</span> HueGuessr</Link></li>
      </ul>
    </div>
  )
}

export default Games