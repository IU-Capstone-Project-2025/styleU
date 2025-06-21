import React from 'react';

function Home() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen w-full flex items-center justify-center px-4 md:px-16 relative">
      <div className="absolute top-[15%] left-[11%] z-50">
        <h1 className="text-5xl font-comfortaa text-black tracking-wide">STYLEU</h1>
      </div>

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Левый текст */}
        <div className="text-gray-700 text-sm font-anaheim md:pr-6 text-left">
          <p>
            An AI-assistant which will help you <br />
            choose the perfect outfit and give <br />
            recommendations based on your color <br />
            type and parameters
          </p>
        </div>

        {/* Центральный блок */}
        <div className="flex flex-col items-center text-center mt-30 space-y-5">
          <h2 className="text-5xl font-comfortaa text-black mb-7 text-left whitespace-nowrap leading-tight">
            Intelligent fashion,<br />tailored to you.
          </h2>

          <div className="relative flex w-fit mx-auto">
            <button
              className="bg-[#EEECEA] text-black pl-12 pr-20 py-3 text-lg font-anaheim rounded-full shadow-md z-10"
            >
              Try it for free!
            </button>

            <button
              className="bg-black text-white pl-16 pr-16 py-3 text-lg font-anaheim rounded-full shadow-md -ml-10 z-20"
            >
              LOGIN
            </button>
          </div>
        </div>

        {/* Правый текст */}
        <div className="text-gray-700 text-sm font-anaheim md:pl-6 text-right">
          <p>
            Shop clothes that would fit<br />
            and match you perfectly
          </p>
        </div>
      </div>

      {/* Down arrow */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce z-10">
        <button
          onClick={scrollToAbout}
          className="w-10 h-10 rounded-full bg-black text-white text-xl flex items-center justify-center shadow-md hover:scale-110 transition"
          aria-label="Scroll to About"
        >
          ↓
        </button>
      </div>
    </section>
  );
}

export default Home;
