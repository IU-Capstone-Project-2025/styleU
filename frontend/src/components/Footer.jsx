import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentLang = i18n.language;

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <footer className="w-full bg-[#f2f2f2] text-gray-700 text-sm px-4 pt-8 pb-4 mt-0 border-t border-gray-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Basic info */}
        <div className="text-center md:text-left">
          <p className="font-medium">STYLEU © {new Date().getFullYear()}</p>
          <p>{t('footer.rights', 'All rights reserved.')}</p>
        </div>

        {/* Language Switch */}
        <div className="flex gap-3">
          {['en', 'ru'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center border transition duration-200
                ${currentLang === lang
                  ? 'bg-black text-white border-black'
                  : 'bg-transparent text-black border-black hover:bg-black hover:text-white'}`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
