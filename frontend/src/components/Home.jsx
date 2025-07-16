import React from 'react';
import arrow from '../assets/arrowWhite.png';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

function Home() {
  const { t } = useTranslation();

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

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center font-noto font-light px-4 sm:px-6"
    >
      {/* STYLEU logo */}
      <div className="absolute top-6 left-4 sm:top-10 sm:left-[6%] z-10">
        <h1 className="text-3xl sm:text-4xl font-comfortaa text-black">STYLEU</h1>
      </div>

      {/* Language toggle */}
      <div className="absolute top-6 right-4 sm:top-10 sm:right-[6%] z-10">
        <button
          onClick={toggleLanguage}
          className="w-10 h-10 rounded-full bg-black text-white text-sm font-medium shadow-md flex items-center justify-center transition hover:opacity-80"
        >
          {i18n.language === 'ru' ? 'EN' : 'RU'}
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center text-center mt-20 space-y-6 sm:space-y-5 px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-comfortaa text-black leading-snug sm:leading-tight">
          {t('smartFashion')}
        </h2>

        <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-0">
          <span className="bg-[#EEECEA] text-black px-8 py-2 sm:pl-12 sm:pr-20 sm:py-3 text-base sm:text-lg font-noto rounded-full shadow-md z-10">
            {t('tryFree')}
          </span>

          <button
            onClick={scrollToLogin}
            className="bg-black text-white px-10 py-2 sm:pl-16 sm:pr-16 sm:py-3 text-base sm:text-lg font-noto rounded-full shadow-md sm:-ml-10 z-20 hover:opacity-80 transition"
          >
            {t('login')}
          </button>
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce z-10">
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
