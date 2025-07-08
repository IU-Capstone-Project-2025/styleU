import './index.css';
import background from './assets/background.jpeg';
import colorBodyBackground from './assets/color-body-background.png';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import ColorType from './components/ColorType';
import BodyShape from './components/BodyShape';
import Login from './components/Login';
import Register from './components/Register'; 

function ScrollNavbarWrapper({ children }) {
  const [showNavbar, setShowNavbar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY > window.innerHeight * 0.75);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans text-gray-800">
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
}

function MainPage() {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center -120px',
        }}
        className="w-full"
      >
        <Home />
        <About />
      </div>

      <div
        style={{
          backgroundImage: `url(${colorBodyBackground})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          padding: '50px 0',
        }}
      >
        <ColorType />
        <BodyShape />
      </div>
      
      <div id="login" style={{ background: 'white', minHeight: '100vh', padding: '50px 0' }}>
        <Login />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollNavbarWrapper>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<SectionWrapper><Login /></SectionWrapper>} />
          <Route path="/register" element={<SectionWrapper><Register /></SectionWrapper>} />
        </Routes>
      </ScrollNavbarWrapper>
    </Router>
  );
}

function SectionWrapper({ children }) {
  return (
    <div
      style={{
        background: 'white',
        padding: '50px 0',
        minHeight: '80vh',
      }}
    >
      {children}
    </div>
  );
}

export default App;