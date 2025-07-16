import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserIcon, Menu } from 'lucide-react';

function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // --- update active section on scroll OR route ---
  useEffect(() => {
    const handleScroll = () => {
      if (!isAuthenticated && location.pathname === '/') {
        const sections = ['home', 'about', 'color', 'shape', 'login', 'shop', 'profile'];
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        let currentSection = '';
        for (const id of sections) {
          const element = document.getElementById(id);
          if (element && element.offsetTop <= scrollPosition) {
            currentSection = id;
          }
        }
        setActiveSection(currentSection);
      }
    };

    handleScroll(); // run once on mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, isAuthenticated]);

  useEffect(() => {
    // if logged in, use pathname for active page
    if (isAuthenticated) {
      const path = location.pathname;
      if (path.startsWith('/shop')) setActiveSection('shop');
      else if (path.startsWith('/color')) setActiveSection('color');
      else if (path.startsWith('/shape')) setActiveSection('shape');
      else if (path.startsWith('/personal')) setActiveSection('profile');
    }
  }, [location.pathname, isAuthenticated]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 10;
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const linkClass = (section) =>
    `cursor-pointer text-xs sm:text-sm transition-all ${
      activeSection === section ? 'font-bold' : ''
    }`;

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden md:flex w-[90%] max-w-5xl mx-auto justify-between items-center px-6 py-3 transition-all duration-300 fixed top-6 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-60 backdrop-blur-md rounded-full shadow-md z-50">
        <h1
          onClick={() => (isAuthenticated ? navigate('/personal') : scrollToSection('home'))}
          className="text-md font-semibold tracking-wider cursor-pointer"
        >
          STYLEU
        </h1>
        <nav className="flex items-center space-x-6 text-sm">
          {isAuthenticated ? (
            <>
              <span onClick={() => navigate('/shop')} className={linkClass('shop')}>Магазин</span>
              <span onClick={() => navigate('/color')} className={linkClass('color')}>Цветотип</span>
              <span onClick={() => navigate('/shape')} className={linkClass('shape')}>Тип фигуры</span>
              <span
                onClick={() => navigate('/personal')}
                className={`w-9 h-9 rounded-full bg-black text-white flex items-center justify-center cursor-pointer ${
                  activeSection === 'profile' ? 'ring-2 ring-black ring-offset-2' : ''
                }`}
                title="Личный кабинет"
              >
                <UserIcon className="w-4 h-4" />
              </span>
              <button onClick={logout} className="text-xs text-red-500 underline ml-2">Выйти</button>
            </>
          ) : (
            <>
              <span onClick={() => scrollToSection('about')} className={linkClass('about')}>О нас</span>
              <span onClick={() => scrollToSection('color')} className={linkClass('color')}>Цветотип</span>
              <span onClick={() => scrollToSection('shape')} className={linkClass('shape')}>Тип фигуры</span>
              <button
                onClick={() => scrollToSection('login')}
                className={`px-4 py-1 rounded-full text-xs transition-all duration-300 ${
                  activeSection === 'login'
                    ? 'bg-white text-black border border-black font-semibold'
                    : 'bg-black text-white hover:opacity-80'
                }`}
              >
                Войти
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Mobile Navbar */}
      <header className="md:hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] flex justify-between items-center px-4 py-2 bg-white bg-opacity-70 backdrop-blur-md rounded-full shadow-md">
        <h1
          onClick={() => (isAuthenticated ? navigate('/personal') : scrollToSection('home'))}
          className="text-sm font-semibold tracking-wider cursor-pointer"
        >
          STYLEU
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-1/2 transform -translate-x-1/2 w-[90%] bg-white rounded-xl shadow-lg py-4 px-6 z-40 text-xs font-light text-center space-y-4">
          {isAuthenticated ? (
            <>
              <div onClick={() => { navigate('/shop'); setIsMobileMenuOpen(false); }} className={linkClass('shop')}>Магазин</div>
              <div onClick={() => { navigate('/color'); setIsMobileMenuOpen(false); }} className={linkClass('color')}>Цветотип</div>
              <div onClick={() => { navigate('/shape'); setIsMobileMenuOpen(false); }} className={linkClass('shape')}>Тип фигуры</div>
              <div
                onClick={() => { navigate('/personal'); setIsMobileMenuOpen(false); }}
                className={`flex items-center justify-center gap-2 cursor-pointer ${activeSection === 'profile' ? 'font-bold' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span>Личный кабинет</span>
              </div>
              <button onClick={logout} className="text-red-500 underline">Выйти</button>
            </>
          ) : (
            <>
              <div onClick={() => scrollToSection('about')} className={linkClass('about')}>О нас</div>
              <div onClick={() => scrollToSection('color')} className={linkClass('color')}>Цветотип</div>
              <div onClick={() => scrollToSection('shape')} className={linkClass('shape')}>Тип фигуры</div>
              <button
                onClick={() => scrollToSection('login')}
                className={`px-4 py-1 rounded-full text-xs transition-all duration-300 ${
                  activeSection === 'login'
                    ? 'bg-white text-black border border-black font-semibold'
                    : 'bg-black text-white hover:opacity-80'
                }`}
              >
                Войти
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
