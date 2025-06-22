import React, { useEffect, useState } from 'react';

function Navbar() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'color', 'shape', 'login'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let currentSection = '';
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 10;
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const linkClass = (section) =>
    `cursor-pointer transition-all ${
      activeSection === section ? 'font-bold' : ''
    }`;

  return (
    <header className="w-full flex justify-between items-center px-8 py-4 transition-all duration-300 fixed top-6 left-1/2 transform -translate-x-1/2 max-w-4xl bg-white bg-opacity-60 backdrop-blur-md rounded-full shadow-md z-20">
      <h1
        onClick={() => scrollToSection('home')}
        className="text-md font-semibold tracking-wider cursor-pointer"
      >
        STYLEU
      </h1>
      <nav className="flex items-center space-x-6 text-sm">
        <span onClick={() => scrollToSection('about')} className={linkClass('about')}>About</span>
        <span onClick={() => scrollToSection('color')} className={linkClass('color')}>Color type</span>
        <span onClick={() => scrollToSection('shape')} className={linkClass('shape')}>Body shape</span>
        <button
          onClick={() => scrollToSection('login')}
          className={`px-4 py-1 rounded-full text-xs transition-all duration-300 ${
            activeSection === 'login'
              ? 'bg-white text-black border border-black font-semibold'
              : 'bg-black text-white hover:opacity-80'
          }`}
        >
          LOGIN
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
