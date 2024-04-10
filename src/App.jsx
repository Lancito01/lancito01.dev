import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/layout/Layout";
import Home from "./Routes/Home";
import About from "./Routes/About";
import AndyBot from "./Routes/AndyBot";
import AndyScript from "./Routes/AndyScript";

import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>

            <Route path="/" element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/andybot" element={<AndyBot />}></Route>
            <Route path="/andyscript" element={<AndyScript />}></Route>

          </Route>
        </Routes >
      </BrowserRouter >
      <SpeedInsights /> {/*!from Vercel */}
      <Analytics /> {/*!from Vercel */}
    </div>
  )
}

export default App