import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
import ColorType from "./Components/ColorType";
import BodyShape from "./Components/BodyShape";
import Login from "./Components/Login";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="bg-[#fff8dc]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/color-type" element={<ColorType />} />
          <Route path="/body-shape" element={<BodyShape />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;