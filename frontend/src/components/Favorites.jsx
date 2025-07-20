import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFavorites, removeFavorite } from '../services/api';
import OutfitCarousel from './OutfitCarousel';
import arrowBlack from '../assets/arrowBlack.png';

export default function Favorites() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await getFavorites(token);
        setFavorites(res || []);
      } catch (err) {
        setError(t('favorites.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [t]);

  const handleRemoveFavorite = async (outfit, idx) => {
    try {
      const token = localStorage.getItem('token');
      await removeFavorite(outfit, token);
      setFavorites((prev) => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -600, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 600, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white px-4 pt-24 pb-10">
      <h2 className="text-3xl md:text-5xl font-comfortaa font-normal mb-10 tracking-wider text-center w-full">
        {t('favorites.title')}
      </h2>

      <div className="relative w-full max-w-6xl bg-[#f3f3f3] rounded-xl shadow-2xl font-noto font-light mt-4 px-6 py-10">
        {loading ? (
          <div className="text-gray-400 text-xl mt-20 text-center">{t('favorites.loading')}</div>
        ) : error ? (
          <div className="text-red-500 text-xl mt-20 text-center">{error}</div>
        ) : favorites.length === 0 ? (
          <div className="text-gray-400 text-xl mt-20 text-center">{t('favorites.empty')}</div>
        ) : (
          <div className="relative flex items-center">
            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              className="absolute left-[-20px] z-10 bg-white rounded-full shadow-lg p-2"
            >
              <img src={arrowBlack} alt="Left" className="w-6 h-6" />
            </button>

            {/* Carousel */}
            <div
              ref={scrollContainerRef}
              className="flex gap-3 px-4"
              style={{
                overflowX: 'hidden',
                scrollBehavior: 'smooth',
                maxWidth: '100%',
              }}
            >
              {favorites.map((outfit, idx) => (
                <div key={idx} className="min-w-[30%] md:min-w-[50%] lg:min-w-[30%]">
                  <OutfitCarousel
                    outfits={[outfit]}
                    showTitle={false}
                    hideReason={true}
                    isFavorites={true}
                    onRemoveFavorite={(o) => handleRemoveFavorite(o, idx)}
                    carousel3={true}
                  />
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              className="absolute right-[-20px] z-10 bg-white rounded-full shadow-lg p-2"
            >
              <img src={arrowBlack} alt="Right" className="w-6 h-6 rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
