import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserParameters } from '../services/api';

function PersonalPage() {
  const { t } = useTranslation();
  const { user: authUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userParams, setUserParams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserParams = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Нет токена');
        const params = await getUserParameters(token);
        setUserParams(params);
      } catch (err) {
        // Если ошибка связана с отсутствием данных (404, 422), показываем дефолтную карточку
        if (err?.response && (err.response.status === 404 || err.response.status === 422 || err.response.status === 400)) {
          setUserParams({});
        } else {
          setError('Ошибка загрузки данных пользователя');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserParams();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="relative w-full max-w-5xl bg-[#f3f3f3] rounded-xl p-16 pt-14 pb-32 shadow-2xl font-noto font-light">
        <div className="flex flex-row items-start w-full">
          <div className="flex-1 flex flex-col items-start mx-auto">
            <h1 className="text-5xl font-comfortaa font-semibold mb-14 mt-2 text-center w-full tracking-tight text-gray-800">
              {t('personal.welcome')}, <span className="font-comfortaa font-semibold text-primary-700">{authUser?.username || t('personal.user')}</span>
            </h1>

            {loading ? (
              <div className="text-xl text-gray-500 text-center w-full my-10">Загрузка...</div>
            ) : error ? (
              <div className="text-xl text-red-500 text-center w-full my-10">{error}</div>
            ) : (
              <>
                <div className="flex justify-between w-full max-w-2xl text-center mx-auto text-2xl">
                  <div className="pl-4">
                    <div className="text-gray-500 text-lg font-noto font-light mb-1">{t('personal.sex')}</div>
                    <div className="font-bold">
                      {userParams?.sex ? (userParams.sex === 'male' ? 'Мужской' : 'Женский') : <span className="inline-block w-10 border-b border-gray-300 text-gray-300">&nbsp;</span>}
                    </div>
                  </div>
                  <div className="pr-4">
                    <div className="text-gray-500 text-lg font-noto font-light mb-1">{t('personal.height')}</div>
                    <div className="font-bold">
                      {userParams?.height ? userParams.height : <span className="inline-block w-10 border-b border-gray-300 text-gray-300">&nbsp;</span>}
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-2xl border-b border-gray-300 my-10 mx-auto" />

                <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto mt-10 text-2xl">
                  <div className="flex items-center gap-6 w-full">
                    <div className="text-gray-600 min-w-[120px] text-xl font-noto font-light">Цветотип</div>
                    {userParams?.color_type ? (
                      <div className="text-2xl font-bold ml-auto text-primary-700">{userParams.color_type}</div>
                    ) : (
                      <button
                        className="px-12 py-3 bg-gray-200 text-black rounded-full shadow-md hover:bg-gray-300 transition text-xl ml-auto font-medium"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
                        onClick={() => navigate('/color')}
                      >
                        Узнать!
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-6 w-full">
                    <div className="text-gray-600 min-w-[120px] text-xl font-noto font-light">Тип фигуры</div>
                    {userParams?.body_type ? (
                      <div className="text-2xl font-bold ml-auto text-primary-700">{userParams.body_type}</div>
                    ) : (
                      <button
                        className="px-12 py-3 bg-gray-200 text-black rounded-full shadow-md hover:bg-gray-300 transition text-xl ml-auto font-medium"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
                        onClick={() => navigate('/shape')}
                      >
                        Узнать!
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
            {/* Кнопка выхода в правом нижнем углу карточки */}
            <button
              onClick={handleLogout}
              className="absolute right-8 bottom-8 px-6 py-2 bg-gray-300 text-gray-700 rounded-full shadow hover:bg-gray-400 transition text-base font-normal z-20 border border-gray-400"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
              {t('personal.logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalPage;
