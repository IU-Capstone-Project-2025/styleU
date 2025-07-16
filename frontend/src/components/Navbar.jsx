import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserIcon, Menu } from 'lucide-react';
import heartOutline from '../assets/heart-outline.png';

// Мини-меню навигации слева
function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-40">
      <button onClick={() => navigate('/personal')} className={`w-12 h-12 rounded-full flex items-center justify-center border ${location.pathname === '/personal' ? 'bg-black text-white' : 'bg-white text-black'}`}> <UserIcon className="w-6 h-6" /> </button>
      <div className="flex flex-col gap-3 items-center">
        {[1,2,3,4].map((_,i) => <div key={i} className="w-4 h-4 rounded-full bg-gray-400 opacity-60" />)}
      </div>
      <button onClick={() => navigate('/favorites')} className={`w-12 h-12 rounded-full flex items-center justify-center border ${location.pathname === '/favorites' ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <img src={heartOutline} alt="favorites" className={`w-6 h-6 transition ${location.pathname === '/favorites' ? 'filter invert' : ''}`} />
      </button>
    </div>
  );
}

function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
      {(location.pathname === '/personal' || location.pathname === '/favorites') && <SideNav />}
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
              <button onClick={handleLogout} className="text-xs text-red-500 underline ml-2">Выйти</button>
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
                className={linkClass('profile')}
              >
                Личный кабинет
              </div>
            </>
          ) : (
            <>
              <div onClick={() => { scrollToSection('about'); setIsMobileMenuOpen(false); }} className={linkClass('about')}>О нас</div>
              <div onClick={() => { scrollToSection('color'); setIsMobileMenuOpen(false); }} className={linkClass('color')}>Цветотип</div>
              <div onClick={() => { scrollToSection('shape'); setIsMobileMenuOpen(false); }} className={linkClass('shape')}>Тип фигуры</div>
              <div onClick={() => { scrollToSection('login'); setIsMobileMenuOpen(false); }} className={linkClass('login')}>Войти</div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;