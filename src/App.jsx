import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import AndyBot from "./pages/AndyBot/AndyBot.jsx";
import AndyScript from "./pages/AndyScript/AndyScript.jsx";
import Games from "./pages/Games/Games.jsx";
import HueGuessr from "./pages/HueGuessr/HueGuessr.jsx";

import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import Skull from "./pages/Skull/Skull.jsx";
import Discord from "./pages/Discord/Discord.jsx";
import QR from "./pages/QR/QR.jsx";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>

            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/andybot" element={<AndyBot />} />
            <Route path="/andyscript" element={<AndyScript />} />
            <Route path="/games" element={<Games />} />
            <Route path="/💀" element={<Skull />}></Route>
            <Route path="/discord" element={<Discord />}></Route>
            <Route path="/games/hueguessr" element={<HueGuessr />} />
            <Route path="/qr" element={<QR />} />

          </Route>
        </Routes >
      </BrowserRouter >
      <SpeedInsights /> {/*Vercel */}
      <Analytics /> {/*Vercel */}
    </div>
  )
}

export default App