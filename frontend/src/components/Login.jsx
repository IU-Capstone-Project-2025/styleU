import React from 'react';
import arrow from '../assets/arrowBlack.png';

function Login() {
  return (
    <section id="login" className="flex justify-center items-center py-16 px-4">
      <div className="bg-[#eaeaea] p-10 rounded-xl w-full max-w-md shadow-md">
        <h2 className="text-6xl font-comfortaa text-center mb-4 tracking-widest">STYLE<span className="text-[#aaa]">U</span></h2>
        <p className="text-xs text-gray-500 text-center mb-2">
          Don’t have an account? <span className="text-black font-semibold cursor-pointer">Sign up</span>
        </p>

        <form className="flex flex-col space-y-4 mt-4">
          <input
            type="email"
            placeholder="email"
            className="py-2 px-4 rounded-full border border-gray-300 text-sm outline-none"
          />
          <input
            type="password"
            placeholder="password"
            className="py-2 px-4 rounded-full border border-gray-300 text-sm outline-none"
          />
          <button
            type="submit"
            className="ml-auto w-10 h-10 flex items-center justify-center bg-white border border-black rounded-full hover:bg-gray-100 transition"
            >
            <img src={arrow} alt="Submit" className="w-4 h-4 transform -rotate-180" />
            </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
