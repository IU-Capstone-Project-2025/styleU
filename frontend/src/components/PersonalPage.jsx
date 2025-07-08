import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

function PersonalPage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-3xl bg-gray-100 rounded-xl p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full border bg-gray-200 flex items-center justify-center"
            >
              <span className="text-gray-500 text-lg font-semibold">Фото отсутствует</span>
            </div>
            <button
              onClick={logout}
              className="mt-4 px-6 py-2 bg-gray-300 text-black rounded-full shadow hover:bg-gray-400 transition"
            >
              Выйти
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-semibold mb-4">
              Добро пожаловать, <span className="text-black font-bold">{user?.fullName || 'Пользователь'}</span>
            </h1>
            <div className="flex justify-between gap-8 border-t pt-4">
              <div>
                <div className="text-gray-600">Пол</div>
                <div className="text-xl font-semibold">{user?.sex || '-'}</div>
              </div>
              <div>
                <div className="text-gray-600">Вес</div>
                <div className="text-xl font-semibold">{user?.weight || '-'}</div>
              </div>
              <div>
                <div className="text-gray-600">Рост</div>
                <div className="text-xl font-semibold">{user?.height || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="text-gray-600">Цветотип</div>
            <div className="text-lg">{user?.colorType || '—'}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-gray-600">Тип фигуры</div>
            <button className="mt-1 px-6 py-2 bg-gray-300 text-black rounded-full shadow hover:bg-gray-400 transition">
              Узнать!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalPage;
