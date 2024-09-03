import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/layout/Layout.jsx";
import About from "./pages/About/About.jsx";
import Proyects from "./pages/Proyects/Proyects.jsx";
import AndyBot from "./pages/AndyBot/AndyBot.jsx";
import AndyScript from "./pages/AndyScript/AndyScript.jsx";
import Games from "./pages/Games/Games.jsx";
import HueGuessr from "./pages/HueGuessr/HueGuessr.jsx";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Skull from "./pages/Skull/Skull.jsx";
import Discord from "./pages/Discord/Discord.jsx";
import QR from "./pages/QR/QR.jsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<About />} />
                        <Route path="/proyects" element={<Proyects />} />
                        <Route path="/andybot" element={<AndyBot />} />
                        <Route path="/andyscript" element={<AndyScript />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/💀" element={<Skull />}></Route>
                        <Route path="/discord" element={<Discord />}></Route>
                        <Route
                            path="/games/hueguessr"
                            element={<HueGuessr />}
                        />
                        <Route path="/qr" element={<QR />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <SpeedInsights /> {/*Vercel */}
            <Analytics /> {/*Vercel */}
        </>
    );
}

export default App;
