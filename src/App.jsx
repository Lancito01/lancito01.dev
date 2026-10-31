import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "motion/react";
import Layout from "./Components/layout/Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import AndyBot from "./pages/AndyBot/AndyBot.jsx";
import AndyScript from "./pages/AndyScript/AndyScript.jsx";
import Games from "./pages/Games/Games.jsx";
import HueGuessr from "./pages/HueGuessr/HueGuessr.jsx";
import Thump from "./pages/Thump/Thump.jsx";
import ObsHud from "./pages/ObsHud/ObsHud.jsx";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Skull from "./pages/Skull/Skull.jsx";
import QR from "./pages/QR/QR.jsx";

function App() {
    return (
        <>
            {/* "user" skips transform animations for people who prefer reduced motion */}
            <MotionConfig reducedMotion="user">
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/andybot" element={<AndyBot />} />
                            <Route path="/andyscript" element={<AndyScript />} />
                            <Route path="/thump" element={<Thump />} />
                            <Route path="/obs-hud" element={<ObsHud />} />
                            <Route path="/games" element={<Games />} />
                            <Route path="/💀" element={<Skull />}></Route>
                            <Route
                                path="/games/hueguessr"
                                element={<HueGuessr />}
                            />
                            <Route path="/qr" element={<QR />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </MotionConfig>
            <SpeedInsights /> {/*Vercel */}
            <Analytics /> {/*Vercel */}
        </>
    );
}

export default App;
