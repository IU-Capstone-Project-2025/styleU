import React from 'react';

function Navbar() {
  return (
    <header className="w-full flex justify-between items-center px-8 py-4 transition-all duration-300 fixed top-6 left-1/2 transform -translate-x-1/2 max-w-4xl bg-white bg-opacity-60 backdrop-blur-md rounded-full shadow-md z-20">
      <h1 className="text-md font-semibold tracking-wider">STYLEU</h1>
      <nav className="flex items-center space-x-6 text-sm">
        <a href="#about" className="hover:underline">About</a>
        <a href="#color" className="hover:underline">Color type</a>
        <a href="#shape" className="hover:underline">Body shape</a>
        <button className="bg-black text-white px-4 py-1 rounded-full hover:opacity-80 text-xs">LOGIN</button>
      </nav>
    </header>
  );
}

export default Navbar;
