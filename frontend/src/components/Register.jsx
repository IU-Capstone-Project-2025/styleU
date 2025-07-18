import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import arrow from '../assets/arrowBlack.png';
import { registerUser } from '../services/api';

function Register() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert(t('register.fillFields'));
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({ username, password });
      alert(t('register.success'));
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert(t('register.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="register" className="flex justify-center items-center py-16 px-4 min-h-screen">
      <div className="bg-[#eaeaea] p-10 rounded-xl w-full max-w-md shadow-lg border border-gray-200 relative">

        {/* Exit button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-sm text-gray-500 hover:text-black"
        >
          {t('register.exit')}
        </button>

        <h2 className="text-4xl font-comfortaa text-center mb-2 tracking-widest">
          {t('register.title')}
        </h2>
        {/* <p className="text-xs text-gray-400 text-center mb-4">
          {t('register.haveAccount')}{' '}
          <Link to="/login" className="text-black font-semibold">
            {t('register.loginLink')}
          </Link>
        </p> */}

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t('register.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="py-2 px-4 rounded-full border border-gray-300 text-sm outline-none"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder={t('register.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="py-2 px-4 rounded-full border border-gray-300 text-sm outline-none"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="ml-auto w-10 h-10 flex items-center justify-center bg-black border border-black rounded-full hover:opacity-80 transition"
          >
            <img src={arrow} alt={t('register.registerBtn')} className="w-4 h-4 rotate-180 invert" />
          </button>
        </form>
      </div>
    </section>
  );
}

export default Register;
