import './index.css';
import background from './assets/background.jpeg';
import colorBodyBackground from './assets/color-body-background.png';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import ColorType from './components/ColorType';
import BodyShape from './components/BodyShape';
import Login from './components/Login';

function App() {
  const [showNavbar, setShowNavbar] = useState(false);

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

      <div
        style={{
          background: 'white',
          padding: '50px 0',
          minHeight: '80vh',
        }}
      >
        <Login />
      </div>
    </div>
  );
}

export default App;
