import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PersonalPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="relative w-full max-w-3xl bg-[#f3f3f3] rounded-xl p-12 pt-10 pb-24 shadow-md font-noto font-light">

        <div className="flex flex-row items-start w-full">
          {/* Левая часть: фото и кнопка */}
          <div className="flex flex-col items-center min-w-[140px]">
            <div className="w-32 h-32 rounded-full border bg-gray-200 flex items-center justify-center overflow-hidden shadow">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Фото профиля" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 px-6 py-1.5 bg-gray-300 text-black rounded-full shadow-md hover:bg-gray-400 transition text-sm"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
              Выйти
            </button>
          </div>
          {/* Правая часть: текст */}
          <div className="flex-1 flex flex-col items-start ml-12">
            <h1 className="text-3xl font-comfortaa mb-10 mt-2">
              Добро пожаловать, <span className="font-bold">{user?.username || 'Пользователь'}</span>
            </h1>
            <div className="flex justify-between w-full max-w-lg text-center mx-auto">
              <div className="pl-4">
                <div className="text-gray-600">Пол</div>
                <div className="text-xl font-noto font-light">
                  {user?.sex || <span className="inline-block w-8 border-b border-gray-400 text-gray-400">&nbsp;</span>}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Вес</div>
                <div className="text-xl font-noto font-light">
                  {user?.weight || <span className="inline-block w-8 border-b border-gray-400 text-gray-400">&nbsp;</span>}
                </div>
              </div>
              <div className="pr-4">
                <div className="text-gray-600">Рост</div>
                <div className="text-xl font-noto font-light">
                  {user?.height || <span className="inline-block w-8 border-b border-gray-400 text-gray-400">&nbsp;</span>}
                </div>
              </div>
            </div>
            {/* Разделитель */}
            <div className="w-full max-w-lg border-b border-gray-400 my-6 mx-auto" />
            {/* Цветотип и Тип фигуры */}
            <div className="flex flex-col gap-4 w-full max-w-lg mx-auto mt-8">
              <div className="flex items-center gap-4 w-full">
                <div className="text-gray-600 min-w-[90px]">Цветотип</div>
                {user?.colorType ? (
                  <div className="text-lg font-noto font-light">{user.colorType}</div>
                ) : (
                  <button
                    className="px-10 py-2 bg-gray-300 text-black rounded-full shadow-md hover:bg-gray-400 transition text-base ml-auto"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    onClick={() => navigate('/color')}
                  >
                    Узнать!
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 w-full">
                <div className="text-gray-600 min-w-[90px]">Тип фигуры</div>
                {user?.bodyShape ? (
                  <div className="text-lg font-noto font-light">{user.bodyShape}</div>
                ) : (
                  <button
                    className="px-10 py-2 bg-gray-300 text-black rounded-full shadow-md hover:bg-gray-400 transition text-base ml-auto"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    onClick={() => navigate('/shape')}
                  >
                    Узнать!
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalPage;
