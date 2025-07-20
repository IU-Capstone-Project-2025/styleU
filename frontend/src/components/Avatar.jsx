import React, { useState } from 'react';
import { generateAvatar } from '../services/api';
import { useTranslation } from 'react-i18next';

function AvatarSection() {
  const { t } = useTranslation();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setAvatarUrl(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Нет токена');

      const blob = await generateAvatar(token);
      const url = URL.createObjectURL(blob);
      setAvatarUrl(url);
      localStorage.setItem('hasAvatar', 'true');
    } catch (error) {
      console.error(error);
      alert(t('avatar.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="avatar"
      className="px-4 pb-16 font-noto font-light relative min-h-screen"
      style={{ paddingTop: '15vh' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl mb-8 font-comfortaa">
          {t('avatar.title')}
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          {t('avatar.description')}
        </p>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-black text-white px-8 py-3 rounded-full shadow-lg hover:bg-gray-800 transition"
        >
          {loading ? t('avatar.analyzing') : t('avatar.analyze')}
        </button>

        {loading && <p className="mt-6 text-gray-500">Пожалуйста, подождите...</p>}

        {avatarUrl && (
          <div className="mt-10">
            <h3 className="text-2xl mb-4">{t('avatar.generated')}:</h3>
            <img
              src={avatarUrl}
              alt="Avatar"
              className="rounded-lg border shadow-lg mx-auto"
              style={{ width: '300px', height: 'auto' }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default AvatarSection;