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
import PersonalPage from './components/PersonalPage'; // ← новая личная страница
import { AuthContext, AuthProvider } from './components/AuthContext'; // ← обёртка контекста
import Shop from './components/Shop'; // добавить импорт

function ScrollNavbarWrapper({ children }) {
  const [showNavbar, setShowNavbar] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      setShowNavbar(true);
      return;
    }
    const handleScroll = () => {
      setShowNavbar(window.scrollY > window.innerHeight * 0.75);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <ScrollNavbarWrapper>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<SectionWrapper><Login /></SectionWrapper>} />
        <Route path="/register" element={<SectionWrapper><Register /></SectionWrapper>} />
        <Route path="/personal" element={isAuthenticated ? (<SectionWrapper><PersonalPage /></SectionWrapper>) : (<Navigate to="/" />)} />
        <Route path="/shop" element={isAuthenticated ? (<SectionWrapper><Shop /></SectionWrapper>) : (<Navigate to="/" />)} />
        <Route path="/color" element={isAuthenticated ? (<SectionWrapper><ColorType /></SectionWrapper>) : (<Navigate to="/" />)} />
        <Route path="/shape" element={isAuthenticated ? (<SectionWrapper><BodyShape /></SectionWrapper>) : (<Navigate to="/" />)} />
      </Routes>
    </ScrollNavbarWrapper>
  );
}

function SectionWrapper({ children }) {
  const location = useLocation();
  const isColorOrShape = location.pathname === '/color' || location.pathname === '/shape';
  return (
    <div
      style={isColorOrShape ? {
        backgroundImage: `url(${colorBodyBackground})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        padding: '50px 0',
        minHeight: '80vh',
      } : {
        background: 'white',
        padding: '50px 0',
        minHeight: '80vh',
      }}
    >
      {children}
    </div>
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
