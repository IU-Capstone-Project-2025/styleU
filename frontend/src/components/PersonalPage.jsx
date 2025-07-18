import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from './AuthContext';
import { UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PersonalPage() {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="relative w-full max-w-4xl bg-[#f3f3f3] rounded-xl p-12 pt-10 pb-40 shadow-md font-noto font-light">
        <div className="flex flex-row items-start w-full">
          <div className="flex flex-col items-center min-w-[180px]">
            <div className="w-40 h-40 rounded-full border bg-gray-200 flex items-center justify-center overflow-hidden shadow">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt={t('personal.photoAlt')} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-20 h-20 text-gray-400" />
              )}
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 px-6 py-1.5 bg-gray-300 text-black rounded-full shadow-md hover:bg-gray-400 transition text-sm"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
              {t('personal.logout')}
            </button>
          </div>

          <div className="flex-1 flex flex-col items-start ml-12">
            <h1 className="text-3xl font-normal mb-10 mt-2 text-center w-full">
              {t('personal.welcome')}, <span className="font-bold">{user?.username || t('personal.user')}</span>
            </h1>

            <div className="flex justify-between w-full max-w-lg text-center mx-auto">
              <div className="pl-4">
                <div className="text-gray-600">{t('personal.sex')}</div>
                <div className="text-xl font-noto font-light">
                  {user?.sex || <span className="inline-block w-8 border-b border-gray-400 text-gray-400">&nbsp;</span>}
                </div>
              </div>
              <div>
                <div className="text-gray-600">{t('personal.weight')}</div>
                <div className="text-xl font-noto font-light">
                  {user?.weight || <span className="inline-block w-8 border-b border-gray-400 text-gray-400">&nbsp;</span>}
                </div>
              </div>
              <div className="pr-4">
                <div className="text-gray-600">{t('personal.height')}</div>
                <div className="text-xl font-noto font-light">
                  {user?.height || <span className="inline-block w-8 border-b border-gray-400 text-gray-400">&nbsp;</span>}
                </div>
              </div>
            </div>

            <div className="w-full max-w-lg border-b border-gray-400 my-6 mx-auto" />

            <div className="flex flex-col gap-4 w-full max-w-lg mx-auto mt-8">
              <div className="flex items-center gap-4 w-full">
                <div className="text-gray-600 min-w-[90px]">Цветотип</div>
                {user?.colorType ? (
                  <div className="text-lg font-normal ml-auto">{user.colorType}</div>
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
                  <div className="text-lg font-normal ml-auto">{user.bodyShape}</div>
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
