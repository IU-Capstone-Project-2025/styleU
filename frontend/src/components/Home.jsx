import React from 'react';
import arrow from '../assets/arrowWhite.png';

function Home() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToLogin = () => {
    const loginSection = document.getElementById('login');
    if (loginSection) {
      const offset = 10;
      const y = loginSection.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center font-noto font-light px-6"
    >
      {/* Логотип STYLEU */}
      <div className="absolute top-10 left-[6%] z-10">
        <h1 className="text-4xl font-comfortaa text-black">STYLEU</h1>
      </div>

      {/* Центральный блок */}
      <div className="flex flex-col items-center text-center mt-30 space-y-5">
        <h2 className="text-4xl font-comfortaa text-black mb-7 text-left whitespace-nowrap leading-tight">
          Интеллектуальная мода,<br />созданная для вас.
        </h2>

        <div className="relative flex w-fit mx-auto">
          <span className="bg-[#EEECEA] text-black pl-12 pr-20 py-3 text-lg font-noto rounded-full shadow-md z-10">
            Попробуйте бесплатно!
          </span>

          <button
            onClick={scrollToLogin}
            className="bg-black text-white pl-16 pr-16 py-3 text-lg font-noto rounded-full shadow-md -ml-10 z-20 hover:opacity-80 transition"
          >
            ВОЙТИ
          </button>
        </div>
      </div>

      {/* Текст слева */}
      <div className="absolute top-1/2 left-[6%] -translate-y-1/2 text-sm text-gray-700 max-w-[210px] font-noto">
        <p>
          AI-помощник, который поможет<br />
          подобрать идеальный образ и<br />
          дать рекомендации на основе<br />
          вашего цветотипа и параметров
        </p>
      </div>

      {/* Текст справа */}
      <div className="absolute top-1/2 right-[6%] -translate-y-1/2 text-sm text-gray-700 max-w-[210px] text-right font-noto">
        <p>
          Покупайте одежду,<br />
          которая идеально вам подойдёт
        </p>
      </div>

      {/* Стрелка вниз */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce z-10">
        <button
          onClick={scrollToAbout}
          className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-md hover:scale-110 transition"
          aria-label="Scroll to About"
        >
          <img src={arrow} alt="Down arrow" className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export default Home;
