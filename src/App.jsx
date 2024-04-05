import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/layout/Layout";
import Home from "./Routes/Home";
import About from "./Routes/About";
import AndyBot from "./Routes/AndyBot";
import AndyScript from "./Routes/AndyScript";

function App() {
  return (
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
  )
}

export default App