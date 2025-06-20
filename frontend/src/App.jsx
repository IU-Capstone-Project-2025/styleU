import './index.css';
import background from './assets/background2.png';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';

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
        style={{ backgroundImage: `url(${background})` }}
        className="bg-cover bg-center bg-no-repeat min-h-screen w-full"
      >
        <Home />
        <About />
      </div>
    </div>
  );
}

export default App;
