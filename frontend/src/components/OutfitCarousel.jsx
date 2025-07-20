import React, { useEffect, useState } from 'react';
import arrow from '../assets/arrowBlack.png';
import heartEmpty from '../assets/heart-outline.png';
import heartFilled from '../assets/heart-filled.png';
import { useTranslation } from 'react-i18next';
import { addToFavorites } from '../services/api';

export default function OutfitCarousel({ outfits = [], messages, showTitle = true, hideReason = false, isFavorites = false, onRemoveFavorite, carousel3 = false }) {
  const { t, i18n } = useTranslation();
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [itemIndices, setItemIndices] = useState([]);
  const [liked, setLiked] = useState([]);
  const [favoriteStatus, setFavoriteStatus] = useState([]);
  const [message, setMessage] = useState(null);

  // Для режима 3 в ряд
  const [carouselPage, setCarouselPage] = useState(0);
  const pageSize = 3;
  const totalPages = carousel3 ? Math.ceil((outfits?.length || 0) / pageSize) : (outfits?.length || 0);

  // Индексы товаров для каждого аутфита на текущей странице (только для carousel3)
  const [itemIndices3, setItemIndices3] = useState([0, 0, 0]);
  useEffect(() => {
    if (carousel3) {
      setItemIndices3(Array(pageSize).fill(0));
    }
  }, [carouselPage, carousel3, outfits]);

  const outfitsToShow = carousel3
    ? outfits ? outfits.slice(carouselPage * pageSize, carouselPage * pageSize + pageSize) : []
    : outfits ? [outfits[outfitIndex]] : [];

  const handlePrevPage = () => {
    setCarouselPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  const handleNextPage = () => {
    setCarouselPage((prev) => (prev + 1) % totalPages);
  };

  useEffect(() => {
    if (outfits && outfits.length > 0) {
      setItemIndices(outfits.map(() => 0));
      setLiked(outfits.map(() => false));
      setFavoriteStatus(outfits.map(() => false));
      setOutfitIndex(0);
    }
  }, [outfits]);

  if (!outfits) {
    return (
      <div className="flex justify-center items-center min-h-[200px] mt-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  if (outfits.length === 0) return null;

  const currentOutfit = outfits[outfitIndex];
  const currentItemIndex = itemIndices[outfitIndex] || 0;
  const isOverview = currentItemIndex === 0;
  const currentItem = !isOverview ? currentOutfit.items[currentItemIndex - 1] : null;

  const totalPrice = currentOutfit.items.reduce((sum, item) => sum + item.price, 0);
  const marketplaces = [...new Set(currentOutfit.items.map((item) => item.marketplace))].join(', ');

  const nextOutfit = () => setOutfitIndex((prev) => (prev + 1) % outfits.length);
  const prevOutfit = () => setOutfitIndex((prev) => (prev - 1 + outfits.length) % outfits.length);

  const nextItem = () => {
    setItemIndices((prev) => {
      const updated = [...prev];
      const next = (updated[outfitIndex] + 1) % (currentOutfit.items.length + 1);
      updated[outfitIndex] = next;
      return updated;
    });
  };

  const prevItem = () => {
    setItemIndices((prev) => {
      const updated = [...prev];
      const prevIndex = (updated[outfitIndex] - 1 + currentOutfit.items.length + 1) % (currentOutfit.items.length + 1);
      updated[outfitIndex] = prevIndex;
      return updated;
    });
  };

  const toggleHeart = () => {
    setLiked((prev) => {
      const updated = [...prev];
      updated[outfitIndex] = !updated[outfitIndex];
      return updated;
    });
  };

  const handleAddToFavorites = async () => {
    const token = localStorage.getItem('token');
    try {
      await addToFavorites(currentOutfit, token);
      setFavoriteStatus((prev) => {
        const updated = [...prev];
        updated[outfitIndex] = true;
        return updated;
      });
      setMessage('Добавлено в избранное!');
    } catch (err) {
      setMessage('Ошибка при добавлении в избранное');
    }
    setTimeout(() => setMessage(null), 2000);
  };

  const handleRemoveFavorite = () => {
    if (onRemoveFavorite) {
      onRemoveFavorite(currentOutfit, outfitIndex);
    }
  };

  // Функции для листания товаров внутри аутфита (carousel3)
  const nextItem3 = (idx, itemsLength) => {
    setItemIndices3((prev) => {
      const updated = [...prev];
      updated[idx] = (updated[idx] + 1) % (itemsLength + 1);
      return updated;
    });
  };
  const prevItem3 = (idx, itemsLength) => {
    setItemIndices3((prev) => {
      const updated = [...prev];
      updated[idx] = (updated[idx] - 1 + itemsLength + 1) % (itemsLength + 1);
      return updated;
    });
  };

  return (
    <section className="flex flex-col items-center justify-center pt-24 pb-10 px-4 font-noto transition-all duration-500">
      {showTitle && (
      <h2 className="text-center text-xl md:text-3xl font-light mb-8 font-comfortaa">
        {t('carousel.title')}
      </h2>
      )}

      <div className={`flex ${carousel3 ? 'gap-8' : 'gap-6'} flex-wrap justify-center transition-all duration-500`}>
        {carousel3 ? (
          outfitsToShow.map((outfit, idx) => {
            if (!outfit || !Array.isArray(outfit.items)) return null;
            const currentItemIndex = itemIndices3[idx] || 0;
            const isOverview = currentItemIndex === 0;
            const currentItem = !isOverview ? outfit.items[currentItemIndex - 1] : null;
            return (
              <div key={idx} className="w-[250px] min-h-[320px] bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-md transition-all duration-700 ease-out flex flex-col items-center justify-between p-3 relative">
                {isOverview ? (
                  <>
                    {carousel3 && isFavorites ? (
                      <div className="w-full grid grid-cols-2 gap-2 mb-2">
                        {outfit.items.map((item, i) => (
                          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer">
                            <img
                              src={item.image}
                              alt={`Item ${i}`}
                              className="w-24 h-24 object-cover rounded-md transition duration-300"
                            />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full flex justify-center items-center mb-2 gap-2 flex-wrap">
                        {outfit.items.map((item, i) => (
                          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer">
                            <img
                              src={item.image}
                              alt={`Item ${i}`}
                              className="w-12 h-12 object-cover rounded-md transition duration-300"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-700 w-full mb-2 space-y-1">
                      <p><span className="text-black font-semibold">{t('carousel.totalPrice')}:</span> {outfit.items.reduce((sum, item) => sum + item.price, 0)} ₽</p>
                      <p><span className="text-black font-semibold">{t('carousel.marketplaces')}:</span> {[...new Set(outfit.items.map((item) => item.marketplace))].join(', ')}</p>
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
                    <div className="text-xs text-gray-700 w-full mb-2 space-y-1">
                      <p><span className="text-black font-semibold">{t('carousel.price')}:</span> {currentItem.price} ₽</p>
                      <p><span className="text-black font-semibold">{t('carousel.marketplace')}:</span> {currentItem.marketplace}</p>
                      <p><span className="text-black font-semibold">{t('carousel.reason')}:</span> {currentItem.reason}</p>
                    </div>
                  </>
                )}
                <div className="flex justify-between w-full mt-auto px-2">
                  <button onClick={() => prevItem3(idx, outfit.items.length)} className="hover:scale-110 transition">
                    <img src={arrow} className="w-3 h-3" alt="prev item" />
                  </button>
                  <button onClick={() => nextItem3(idx, outfit.items.length)} className="hover:scale-110 transition">
                    <img src={arrow} className="w-3 h-3 transform rotate-180" alt="next item" />
                  </button>
                </div>
                <button
                  onClick={isFavorites ? () => onRemoveFavorite && onRemoveFavorite(outfit, carouselPage * pageSize + idx) : handleAddToFavorites}
                  className="absolute bottom-3 left-1/2 transform -translate-x-1/2 hover:scale-110 transition"
                >
                  <img
                    src={isFavorites ? heartFilled : heartEmpty}
                    alt="heart"
                    className="w-5 h-5"
                  />
                </button>
                {message && (
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded shadow text-sm text-black border border-gray-200 z-10">
                    {message}
                  </div>
                )}
              </div>
            );
          })
        ) : (
        <div className="w-[320px] min-h-[420px] bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-md transition-all duration-700 ease-out flex flex-col items-center justify-between p-5 relative">
          {isOverview ? (
            <>
              <div className="w-full flex justify-center items-center mb-3 gap-3 flex-wrap">
                {currentOutfit.items.map((item, i) => (
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
                <p><span className="text-black font-semibold">{t('carousel.overallReason')}:</span> {currentOutfit.totalReason}</p>
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
                    className="rounded-xl w-48 h-60 object-cover transition duration-300"
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

          <div className="flex justify-between w-full mt-auto px-4">
            <button onClick={prevItem} className="hover:scale-110 transition">
              <img src={arrow} className="w-3 h-3" alt="prev item" />
            </button>
            <button onClick={nextItem} className="hover:scale-110 transition">
              <img src={arrow} className="w-3 h-3 transform rotate-180" alt="next item" />
            </button>
          </div>

          <button
              onClick={isFavorites ? handleRemoveFavorite : handleAddToFavorites}
            className="absolute bottom-3 left-1/2 transform -translate-x-1/2 hover:scale-110 transition"
          >
            <img
                src={isFavorites ? heartFilled : (favoriteStatus[outfitIndex] ? heartFilled : heartEmpty)}
              alt="heart"
              className="w-5 h-5"
            />
            </button>
            {message && (
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded shadow text-sm text-black border border-gray-200 z-10">
                {message}
              </div>
            )}
          </div>
        )}
      </div>
      {carousel3 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={handlePrevPage}
            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:scale-110 transition"
          >
            <img src={arrow} alt="left" className="w-2.5 h-2.5" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${carouselPage === i ? 'bg-black w-5' : 'bg-gray-400 w-2'}`}
            ></div>
          ))}
          <button
            onClick={handleNextPage}
            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:scale-110 transition"
          >
            <img src={arrow} alt="right" className="w-2.5 h-2.5 transform rotate-180" />
          </button>
        </div>
      )}

      {/* Навигация для обычного режима (Shop) — стрелки и пагинация-кружки */}
      {!carousel3 && outfits && outfits.length > 1 && (
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={prevOutfit}
          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:scale-110 transition"
            aria-label="Предыдущий образ"
        >
          <img src={arrow} alt="left" className="w-2.5 h-2.5" />
        </button>
        {outfits.map((_, i) => (
          <div
            key={i}
              className={`h-2 rounded-full transition-all duration-300 ${outfitIndex === i ? 'bg-black w-5' : 'bg-gray-400 w-2'}`}
              onClick={() => setOutfitIndex(i)}
              style={{ cursor: 'pointer' }}
          ></div>
        ))}
        <button
          onClick={nextOutfit}
          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:scale-110 transition"
            aria-label="Следующий образ"
        >
          <img src={arrow} alt="right" className="w-2.5 h-2.5 transform rotate-180" />
        </button>
      </div>
      )}

    </section>
  );
}
