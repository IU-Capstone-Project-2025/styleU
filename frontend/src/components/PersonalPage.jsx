import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserParameters } from '../services/api';
import { UserIcon } from 'lucide-react';

function PersonalPage() {
  const { t, i18n } = useTranslation();
  const { user: authUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userParams, setUserParams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchUserParams = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const params = await getUserParameters(token);
        setUserParams(params);
        // Загружаем аватар только если был создан
        if (localStorage.getItem('hasAvatar')) {
          try {
            const blob = await import('../services/api').then(m => m.generateAvatar(token));
            if (blob && blob.size > 100) {
              const url = URL.createObjectURL(blob);
              setProfilePhoto(url);
            } else {
              setProfilePhoto(null);
            }
          } catch (e) {
            setProfilePhoto(null);
          }
        } else {
          setProfilePhoto(null);
        }
      } catch (err) {
        if (err?.response && [400, 404, 422].includes(err.response.status)) {
          setUserParams({});
        } else {
          setError(t('personal.error'));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserParams();
  }, [t]);

  const getSexLabel = (sex) => {
    if (!sex) return '';
    return sex === 'male' ? t('personal.male') : t('personal.female');
  };

  // Dictionary: Russian to English ENUM
  const RUS_TO_EN_ENUM = {
    'песочные часы': 'HOURGLASS',
    'груша': 'PEAR',
    'перевёрнутый треугольник': 'INVERTED_TRIANGLE',
    'перевернутый треугольник': 'INVERTED_TRIANGLE',
    'яблоко': 'APPLE',
    'прямоугольник': 'RECTANGLE',
    'неопределённый тип': 'UNKNOWN',
    'трапеция': 'TRAPEZOID',
    'треугольник': 'TRIANGLE',
    'овал': 'OVAL',
  };

  const SHAPE_TRANSLATION = {
    HOURGLASS: t('shapes.HOURGLASS'),
    PEAR: t('shapes.PEAR'),
    INVERTED_TRIANGLE: t('shapes.INVERTED_TRIANGLE'),
    APPLE: t('shapes.APPLE'),
    RECTANGLE: t('shapes.RECTANGLE'),
    UNKNOWN: t('shapes.UNKNOWN'),
    TRAPEZOID: t('shapes.TRAPEZOID'),
    TRIANGLE: t('shapes.TRIANGLE'),
    OVAL: t('shapes.OVAL'),
  };

  const COLOR_TRANSLATION = {
    summer: t('colors.summer'),
    winter: t('colors.winter'),
    autumn: t('colors.autumn'),
    spring: t('colors.spring'),
  };

  const normalizeShape = (value) => {
    if (!value) return '';
    const upper = value.toUpperCase();
    if (SHAPE_TRANSLATION[upper]) return SHAPE_TRANSLATION[upper];
    const mapped = RUS_TO_EN_ENUM[value.toLowerCase()];
    return mapped ? SHAPE_TRANSLATION[mapped] : value;
  };

  const normalizeColor = (value) => {
    if (!value) return '';
    return COLOR_TRANSLATION[value.toLowerCase()] || value;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="relative w-full max-w-5xl bg-[#f3f3f3] rounded-xl p-16 pt-14 pb-32 shadow-2xl font-noto font-light">
        <div className="flex flex-row items-start w-full">
          {/* Левая колонка: аватар и кнопка */}
          <div className="flex flex-col items-center mr-12 min-w-[180px]">
            <div className="w-44 h-44 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shadow border border-gray-300">
              {profilePhoto ? (
                <img src={profilePhoto} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-24 h-24 text-gray-400" />
              )}
            </div>
            {!profilePhoto && (
              <button
                className="mt-6 px-6 py-2 bg-gray-300 text-black rounded-full shadow-md hover:bg-gray-400 transition text-base font-medium"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                onClick={() => navigate('/avatar')}
              >
                {t('personal.avatar')}
              </button>
            )}
          </div>
          <div className="flex-1 flex flex-col items-start mx-auto">
            <h1 className="text-5xl font-comfortaa font-semibold mb-14 mt-2 text-center w-full tracking-tight text-gray-800">
              {t('personal.welcome')},{' '}
              <span className="font-comfortaa font-semibold text-primary-700">
                {authUser?.username || t('personal.user')}
              </span>
            </h1>

            {loading ? (
              <div className="text-xl text-gray-500 text-center w-full my-10">
                {t('personal.loading')}
              </div>
            ) : error ? (
              <div className="text-xl text-red-500 text-center w-full my-10">{error}</div>
            ) : (
              <>
                <div className="flex justify-between w-full max-w-2xl text-center mx-auto text-2xl">
                  <div className="pl-4">
                    <div className="text-gray-500 text-lg font-noto font-light mb-1">{t('personal.sex')}</div>
                    <div className="font-bold uppercase">
                      {userParams?.sex ? getSexLabel(userParams.sex) : <span className="inline-block w-10 border-b border-gray-300 text-gray-300">&nbsp;</span>}
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
                    <div className="text-gray-600 min-w-[120px] text-xl font-noto font-light">{t('personal.color')}</div>
                    {userParams?.color_type ? (
                      <div className="text-2xl uppercase font-medium ml-auto text-primary-700">
                        <b>{normalizeColor(userParams.color_type)}</b>
                      </div>
                    ) : (
                      <button
                        className="px-12 py-3 bg-gray-200 text-black rounded-full shadow-md hover:bg-gray-300 transition text-xl ml-auto font-medium"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
                        onClick={() => navigate('/color')}
                      >
                        {t('personal.findOut')}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-6 w-full">
                    <div className="text-gray-600 min-w-[120px] text-xl font-noto font-light">{t('personal.shape')}</div>
                    {userParams?.body_type ? (
                      <div className="text-2xl uppercase font-medium ml-auto text-primary-700">
                        <b>{normalizeShape(userParams.body_type)}</b>
                      </div>
                    ) : (
                      <button
                        className="px-12 py-3 bg-gray-200 text-black rounded-full shadow-md hover:bg-gray-300 transition text-xl ml-auto font-medium"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
                        onClick={() => navigate('/shape')}
                      >
                        {t('personal.findOut')}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
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
