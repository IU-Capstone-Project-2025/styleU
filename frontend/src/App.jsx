import './index.css';
import background from './assets/background.png';
import { useEffect, useState } from 'react';

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
      {/* NAVBAR */}
      {showNavbar && (
        <header className={`w-full flex justify-between items-center px-8 py-4 transition-all duration-300 ${showNavbar ? 'fixed top-6 left-1/2 transform -translate-x-1/2 max-w-4xl bg-white bg-opacity-60 backdrop-blur-md rounded-full shadow-md z-10' : 'hidden'}`}>
          <h1 className="text-md font-semibold tracking-wider">STYLEU</h1>
          <nav className="flex items-center space-x-6 text-sm">
            <a href="#about" className="hover:underline">About</a>
            <a href="#color" className="hover:underline">Color type</a>
            <a href="#shape" className="hover:underline">Body shape</a>
            <button className="bg-black text-white px-4 py-1 rounded-full hover:opacity-80 text-xs">LOGIN</button>
          </nav>
        </header>
      )}

      {/* BACKGROUND WRAPPER */}
      <div style={{ backgroundImage: `url(${background})` }} className="bg-cover bg-center bg-no-repeat min-h-screen w-full">
        {/* HOME SECTION */}
        <section id="home" className="h-screen flex flex-col justify-center items-center text-center px-4">
          <div className="max-w-xl w-full flex flex-col items-center justify-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black font-comfortaa">Intelligent fashion, tailored to you.</h2>
            <p className="text-sm text-gray-800 font-anaheim mb-8 leading-relaxed max-w-md">
              An AI-assistant which will help you choose the perfect outfit and give recommendations based on your color type and parameters.
            </p>
            <div className="flex space-x-4 mb-6">
              <button className="px-6 py-2 bg-white text-sm rounded-full shadow-md hover:bg-gray-100 font-anaheim">Try it for free!</button>
              <button className="px-6 py-2 bg-black text-white text-sm rounded-full hover:opacity-90 font-anaheim">LOGIN</button>
            </div>
            <a href="#about" className="text-xl animate-bounce text-gray-700">↓</a>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="min-h-screen px-8 py-24 text-center">
          <h2 className="text-3xl font-bold mb-6 font-comfortaa">Perfect wardrobe in just few steps</h2>
          <p className="text-gray-600 mb-10 font-anaheim">Try it yourself! It’s easy, and fun!</p>
          {/* Steps content can go here */}
        </section>
      </div>
    </div>
  );
}

export default App;
