import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import arrow from '../assets/arrowBlack.png';
import { registerUser } from '../services/api';
import { AuthContext } from './AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Пожалуйста, введите имя пользователя и пароль.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser({ username, password });
      const token = response.access_token;
      login(token, { username }); // сохранить токен и логин в контекст
      alert('Регистрация прошла успешно!');
      navigate('/'); // переход на главную
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Пользователь с таким именем уже существует или произошла ошибка.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="register" className="flex justify-center items-center py-16 px-4">
      <div className="bg-[#eaeaea] p-10 rounded-xl w-full max-w-md shadow-md">
        <h2 className="text-6xl font-comfortaa text-center mb-4 tracking-widest">
          STYLE<span className="text-[#aaa]">U</span>
        </h2>
        <p className="text-xs text-gray-500 text-center mb-2">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-black font-semibold">Войдите</Link>
        </p>

        <form className="flex flex-col space-y-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="py-2 px-4 rounded-full border border-gray-300 text-sm outline-none"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="py-2 px-4 rounded-full border border-gray-300 text-sm outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="ml-auto w-10 h-10 flex items-center justify-center bg-white border border-black rounded-full hover:bg-gray-100 transition"
          >
            <img src={arrow} alt="Зарегистрироваться" className="w-4 h-4 transform -rotate-180" />
          </button>
        </form>
      </div>
    </section>
  );
}

export default Register;
