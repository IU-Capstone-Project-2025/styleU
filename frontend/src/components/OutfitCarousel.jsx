import React, { useState, useEffect } from 'react';
import arrow from '../assets/arrowBlack.png';
import heartEmpty from '../assets/heart-outline.png';
import heartFilled from '../assets/heart-filled.png';

export default function OutfitCarousel() {
  const [outfits, setOutfits] = useState([]);
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [itemIndices, setItemIndices] = useState([]);
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    // Fetch from backend
    fetch('/api/outfits') // Replace with your actual backend route
      .then((res) => res.json())
      .then((data) => {
        setOutfits(data);
        setItemIndices(data.map(() => 0));
        setLiked(data.map(() => false));
      });
  }, []);

  const currentOutfit = outfits[outfitIndex];
  const currentItemIndex = itemIndices[outfitIndex] || 0;
  const isOverview = currentItemIndex === 0;

  const currentItem = !isOverview && currentOutfit?.items[currentItemIndex - 1];

  const totalPrice = currentOutfit?.items?.reduce((sum, item) => sum + item.price, 0) || 0;
  const marketplaces = currentOutfit?.items
    ? [...new Set(currentOutfit.items.map((item) => item.marketplace))].join(', ')
    : '';

  const nextOutfit = () => {
    setOutfitIndex((prev) => (prev + 1) % outfits.length);
  };

  const prevOutfit = () => {
    setOutfitIndex((prev) => (prev - 1 + outfits.length) % outfits.length);
  };

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

  return (
    <section className="flex flex-col items-center justify-center pt-24 pb-10 px-4 font-noto transition-all duration-500">
      <h2 className="text-center text-xl md:text-3xl font-light mb-8 font-comfortaa">
        Образы, подобранные специально под ваш запрос
      </h2>

      <div className="flex gap-6 transition-all duration-500 flex-wrap justify-center">
        {outfits.map((outfit, index) => {
          const isActive = index === outfitIndex;
          const activeItemIndex = itemIndices[index];
          const inOverview = activeItemIndex === 0;
          const individualItem = outfit.items[activeItemIndex - 1];

          return (
            <div
              key={index}
              className={`w-[320px] min-h-[420px] bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-md transition-all duration-700 ease-out flex flex-col items-center justify-between p-5 relative ${isActive ? '' : 'opacity-30'}`}
            >
              {inOverview ? (
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
                    <p><span className="text-black font-semibold">Общая стоимость:</span> {totalPrice} ₽</p>
                    <p><span className="text-black font-semibold">Магазины:</span> {marketplaces}</p>
                    <p><span className="text-black font-semibold">Почему именно это:</span> {outfit.totalReason}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full flex justify-center items-center mb-3">
                    <a href={individualItem.link} target="_blank" rel="noopener noreferrer">
                      <img
                        src={individualItem.image}
                        alt="item"
                        className="rounded-xl w-48 h-60 object-cover transition duration-300"
                      />
                    </a>
                  </div>

                  <div className="text-sm text-gray-700 w-full mb-4 space-y-1">
                    <p><span className="text-black font-semibold">Цена:</span> {individualItem.price} ₽</p>
                    <p><span className="text-black font-semibold">Магазин:</span> {individualItem.marketplace}</p>
                    <p><span className="text-black font-semibold">Почему это:</span> {individualItem.reason}</p>
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
                onClick={toggleHeart}
                className="absolute bottom-3 left-1/2 transform -translate-x-1/2 hover:scale-110 transition"
              >
                <img
                  src={liked[index] ? heartFilled : heartEmpty}
                  alt="heart"
                  className="w-5 h-5"
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3 mt-6 transition-all duration-300">
        <button
          onClick={prevOutfit}
          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:scale-110 transition"
        >
          <img src={arrow} alt="left" className="w-2.5 h-2.5" />
        </button>

        {outfits.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              outfitIndex === i ? 'bg-black w-5' : 'bg-gray-400 w-2'
            }`}
          ></div>
        ))}

        <button
          onClick={nextOutfit}
          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:scale-110 transition"
        >
          <img src={arrow} alt="right" className="w-2.5 h-2.5 transform rotate-180" />
        </button>
      </div>
    </section>
  );
}
