import React, { useEffect, useState } from 'react';
import { getFavorites } from '../services/api';
import OutfitCarousel from './OutfitCarousel';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await getFavorites(token);
        setFavorites(res || []);
      } catch (err) {
        setError('Ошибка загрузки избранного');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  // Имитация удаления из избранного (удаляет из локального состояния)
  const handleRemoveFavorite = (outfit, idx) => {
    setFavorites((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 mt-24">
      <h2 className="text-3xl md:text-5xl font-comfortaa font-normal mb-10 tracking-wider text-center w-full">
        Избранные товары
      </h2>
      <div className="relative w-full max-w-5xl bg-[#f3f3f3] rounded-xl p-16 pt-14 pb-32 shadow-2xl font-noto font-light mt-4">
        <div className="flex flex-col items-center w-full">
          {loading ? (
            <div className="text-gray-400 text-xl mt-20">Загрузка...</div>
          ) : error ? (
            <div className="text-red-500 text-xl mt-20">{error}</div>
          ) : favorites.length === 0 ? (
            <div className="text-gray-400 text-xl mt-20">Нет избранных товаров</div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <OutfitCarousel outfits={favorites} showTitle={false} hideReason={true} isFavorites={true} onRemoveFavorite={handleRemoveFavorite} carousel3={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 