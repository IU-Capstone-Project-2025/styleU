import './index.css';
import background from './assets/background.jpeg';
import colorBodyBackground from './assets/color-body-background.png';

import { useEffect, useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import ColorType from './components/ColorType';
import BodyShape from './components/BodyShape';
import Login from './components/Login';
import Register from './components/Register';
import PersonalPage from './components/PersonalPage';
import Shop from './components/Shop';
import Footer from './components/Footer';
import Favorites from './components/Favorites';
import Avatar from './components/Avatar';

import { AuthContext, AuthProvider } from './components/AuthContext';

function ScrollNavbarWrapper({ children }) {
  const [showNavbar, setShowNavbar] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated || location.pathname !== '/') {
      setShowNavbar(true);
    } else {
      const handleScroll = () => {
        setShowNavbar(window.scrollY > window.innerHeight * 0.75);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname, isAuthenticated]);

  return (
    <div className="font-sans text-gray-800">
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
}

function MainPage() {
  const { isAuthenticated } = useContext(AuthContext);
  if (isAuthenticated) return <Navigate to="/personal" />;

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center -120px',
        }}
        className="w-full"
      >
        <Home />
        <About />
      </div>

      <div
        style={{
          backgroundImage: `url(${colorBodyBackground})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          padding: '50px 0',
        }}
      >
        <ColorType />
        <BodyShape />
      </div>

      <div id="login" style={{ background: 'white', minHeight: '100vh', padding: '50px 0' }}>
        <Login />
      </div>
    </>
  );
}

function SectionWrapper({ children }) {
  const location = useLocation();
  const path = location.pathname;

  const isColorOrShapeOrShop = path === '/color' || path === '/shape' || path === '/shop';
  const isPersonal = path === '/personal';

  return (
    <div
      style={
        isColorOrShapeOrShop
          ? {
              backgroundImage: `url(${colorBodyBackground})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              padding: '50px 0',
              minHeight: '80vh',
            }
          : isPersonal
          ? {
              background: 'white',
              padding: '50px 0',
              minHeight: '80vh',
            }
          : {
              background: 'white',
              padding: '50px 0',
              minHeight: '80vh',
            }
      }
    >
      <div className="animate-fade-in">{children}</div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <ScrollNavbarWrapper>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<SectionWrapper><Login /></SectionWrapper>} />
        <Route path="/register" element={<SectionWrapper><Register /></SectionWrapper>} />
        <Route path="/personal" element={<SectionWrapper><PersonalPage /></SectionWrapper>} />
        <Route path="/shop" element={<SectionWrapper><Shop /></SectionWrapper>} />
        <Route path="/color" element={<SectionWrapper><ColorType /></SectionWrapper>} />
        <Route path="/shape" element={<SectionWrapper><BodyShape /></SectionWrapper>} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/avatar" element={<SectionWrapper><Avatar /></SectionWrapper>} />
      </Routes>
      <Footer />
    </ScrollNavbarWrapper>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
