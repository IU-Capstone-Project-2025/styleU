import React, { useEffect, useState } from 'react';
import arrow from '../assets/arrowBlack.png';
import heartEmpty from '../assets/heart-outline.png';
import heartFilled from '../assets/heart-filled.png';
import { useTranslation } from 'react-i18next';
import { addToFavorites } from '../services/api';

export default function OutfitCarousel({
  outfits = [],
  messages,
  showTitle = true,
  hideReason = false,
  isFavorites = false,
  onRemoveFavorite,
}) {
  const { t } = useTranslation();
  const [itemIndices, setItemIndices] = useState([]);
  const [favoriteStatus, setFavoriteStatus] = useState([]);
  const [cardMessages, setCardMessages] = useState([]);

  useEffect(() => {
    if (Array.isArray(outfits) && outfits.length > 0) {
      setItemIndices(outfits.map(() => 0));
      setFavoriteStatus(outfits.map(() => false));
      setCardMessages(outfits.map(() => null));
    }
  }, [outfits]);

  if (!Array.isArray(outfits) || outfits.length === 0) return null;

  const handleNextItem = (index) => {
    const items = outfits?.[index]?.items;
    if (!Array.isArray(items)) return;

    setItemIndices((prev) => {
      const updated = [...prev];
      const next = (updated[index] + 1) % (items.length + 1);
      updated[index] = next;
      return updated;
    });
  };

  const handlePrevItem = (index) => {
    const items = outfits?.[index]?.items;
    if (!Array.isArray(items)) return;

    setItemIndices((prev) => {
      const updated = [...prev];
      const prevIndex = (updated[index] - 1 + items.length + 1) % (items.length + 1);
      updated[index] = prevIndex;
      return updated;
    });
  };

  const handleAddToFavorites = async (outfit, index) => {
    const token = localStorage.getItem('token');
    try {
      await addToFavorites(outfit, token);
      setFavoriteStatus((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
      setCardMessages((prev) => {
        const updated = [...prev];
        updated[index] = 'Добавлено в избранное!';
        return updated;
      });
    } catch (err) {
      setCardMessages((prev) => {
        const updated = [...prev];
        updated[index] = 'Ошибка при добавлении в избранное';
        return updated;
      });
    }

    setTimeout(() => {
      setCardMessages((prev) => {
        const updated = [...prev];
        updated[index] = null;
        return updated;
      });
    }, 2000);
  };

  return (
    <section className="flex flex-col items-center justify-center pt-24 pb-10 px-4 font-noto transition-all duration-500">
      {showTitle && (
        <h2 className="text-center text-xl md:text-3xl font-light mb-8 font-comfortaa">
          {t('carousel.title')}
        </h2>
      )}
      <div className="flex gap-8 flex-wrap justify-center transition-all duration-500">
        {outfits.slice(0, 3).map((outfit, idx) => {
          if (!outfit || !Array.isArray(outfit.items)) return null;

          const currentItemIndex = itemIndices[idx] || 0;
          const isOverview = currentItemIndex === 0;
          const currentItem = !isOverview ? outfit.items[currentItemIndex - 1] : null;
          const totalPrice = outfit.items.reduce((sum, item) => {
            const price = parseFloat(item.price);
            return sum + (isNaN(price) ? 0 : price);
          }, 0);
          const marketplaces = [...new Set(outfit.items.map((item) => item.marketplace))].join(', ');

          return (
            <div
              key={idx}
              className="w-[250px] min-h-[320px] bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-md transition-all duration-700 ease-out flex flex-col items-center justify-between p-3 relative"
            >
              {isOverview ? (
                <>
                  <div className="w-full flex justify-center items-center mb-3 gap-3 flex-wrap">
                    {outfit.items.map((item, i) => (
                      <a key={i} href={item.link} target="_blank" rel="noopener noreferrer">
                        <img
                          src={item.image}
                          alt={`Item ${i}`}
                          className="w-16 h-16 object-cover rounded-md transition duration-300"
                        />
                      </a>
                    ))}
                  </div>
                  <div className="text-sm text-gray-700 w-full mb-4 space-y-1">
                    <p><span className="text-black font-semibold">{t('carousel.totalPrice')}:</span> {totalPrice} ₽</p>
                    <p><span className="text-black font-semibold">{t('carousel.marketplaces')}:</span> {marketplaces}</p>
                    {!hideReason && (
                      <p><span className="text-black font-semibold">{t('carousel.overallReason')}:</span> {outfit.totalReason}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full flex justify-center items-center mb-3">
                    <a href={currentItem.link} target="_blank" rel="noopener noreferrer">
                      <img
                        src={currentItem.image}
                        alt="item"
                        className="rounded-xl w-32 h-40 object-cover transition duration-300"
                      />
                    </a>
                  </div>
                  <div className="text-sm text-gray-700 w-full mb-4 space-y-1">
                    <p><span className="text-black font-semibold">{t('carousel.price')}:</span> {currentItem.price} ₽</p>
                    <p><span className="text-black font-semibold">{t('carousel.marketplace')}:</span> {currentItem.marketplace}</p>
                    <p><span className="text-black font-semibold">{t('carousel.reason')}:</span> {currentItem.reason}</p>
                  </div>
                </>
              )}

              <div className="flex justify-between w-full mt-auto px-2">
                <button onClick={() => handlePrevItem(idx)} className="hover:scale-110 transition">
                  <img src={arrow} className="w-3 h-3" alt="prev item" />
                </button>
                <button onClick={() => handleNextItem(idx)} className="hover:scale-110 transition">
                  <img src={arrow} className="w-3 h-3 transform rotate-180" alt="next item" />
                </button>
              </div>

              <button
                onClick={() =>
                  isFavorites
                    ? onRemoveFavorite?.(outfit, idx)
                    : handleAddToFavorites(outfit, idx)
                }
                className="absolute bottom-3 left-1/2 transform -translate-x-1/2 hover:scale-110 transition"
              >
                <img
                  src={(isFavorites || favoriteStatus[idx]) ? heartFilled : heartEmpty}
                  alt="heart"
                  className="w-5 h-5"
                />
              </button>

              {cardMessages[idx] && (
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded shadow text-sm text-black border border-gray-200 z-10">
                  {cardMessages[idx]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
