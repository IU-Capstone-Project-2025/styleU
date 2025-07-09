import React, { useState } from 'react';
import arrow from '../assets/arrowBlack.png';
import heartEmpty from '../assets/heart-outline.png';
import heartFilled from '../assets/heart-filled.png';
import earrings from '../assets/earrings.png';
import shoes from '../assets/shoes.png';
import dress from '../assets/dress.png';

const links = {
  [dress]: 'https://www.wildberries.ru/catalog/95238289/detail.aspx',
  [shoes]: 'https://www.wildberries.ru/catalog/361490686/detail.aspx',
  [earrings]: 'https://www.wildberries.ru/catalog/388083554/detail.aspx',
};

const outfits = [
  {
    items: [
      {
        image: [dress, earrings, shoes],
        price: 0,
        marketplace: 'Lamoda',
        reason: 'Этот лук идельно походит под ваши параметры и подчеркивает вашу фигуру.',
      },
      {
        image: dress,
        price: 3000,
        marketplace: 'Lamoda',
        reason: 'Приталенный силуэт подчеркивает талию.',
      },
      {
        image: earrings,
        price: 800,
        marketplace: 'Lamoda',
        reason: 'Элегантные и универсальные.',
      },
      {
        image: shoes,
        price: 700,
        marketplace: 'Lamoda',
        reason: 'Устойчивый каблук для вечеринки на пляже.',
      },
    ],
  },
  {}, {}, {}, {},
];

export default function OutfitCarousel() {
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const currentOutfit = outfits[outfitIndex];
  const hasItems = currentOutfit.items && currentOutfit.items.length > 0;
  const currentItem = hasItems ? currentOutfit.items[itemIndex] : null;

  const isOverview = hasItems && Array.isArray(currentItem?.image);

  const totalPrice = hasItems
    ? currentOutfit.items.reduce((sum, item) => sum + item.price, 0)
    : 0;
  const uniqueMarketplace = hasItems
    ? [...new Set(currentOutfit.items.map((i) => i.marketplace))].join(', ')
    : '';

  const nextOutfit = () => {
    setOutfitIndex((prev) => (prev + 1) % outfits.length);
    setItemIndex(0);
    setLiked(false);
  };

  const prevOutfit = () => {
    setOutfitIndex((prev) => (prev - 1 + outfits.length) % outfits.length);
    setItemIndex(0);
    setLiked(false);
  };

  const nextItem = () => {
    if (!hasItems) return;
    setItemIndex((prev) => (prev + 1) % currentOutfit.items.length);
  };

  const prevItem = () => {
    if (!hasItems) return;
    setItemIndex((prev) => (prev - 1 + currentOutfit.items.length) % currentOutfit.items.length);
  };

  const toggleHeart = () => setLiked((prev) => !prev);

  return (
    <section className="flex flex-col items-center justify-center pt-24 pb-10 px-4 font-noto transition-all duration-500">
      <h2 className="text-center text-xl md:text-3xl font-light mb-8 font-comfortaa">
        Образы, подобранные специально под ваш запрос
      </h2>

      <div className="flex gap-6 transition-all duration-500">
        {[0, 1, 2].map((cardIndex) => (
          <div
            key={cardIndex}
            className="w-[320px] min-h-[420px] bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-md hover:shadow-lg transition-all duration-700 ease-out flex flex-col items-center justify-between p-5 relative"
          >
            {cardIndex === 0 && hasItems ? (
              <>
                <div className="w-full flex justify-center items-center mb-3 gap-3 flex-wrap">
                  {isOverview ? (
                    currentItem.image.map((src, i) => (
                      <a key={i} href={links[src]} target="_blank" rel="noopener noreferrer">
                        <img
                          src={src}
                          alt={`Item ${i}`}
                          className="w-16 h-16 object-cover rounded-md transition duration-300"
                        />
                      </a>
                    ))
                  ) : (
                    <a href={links[currentItem.image]} target="_blank" rel="noopener noreferrer">
                      <img
                        src={currentItem.image}
                        alt="item"
                        className="rounded-xl w-48 h-60 object-cover transition duration-300"
                      />
                    </a>
                  )}
                </div>

                <div className="text-sm text-gray-700 w-full mb-4 space-y-1">
                  {isOverview ? (
                    <>
                      <p><span className="text-black font-semibold">Общая стоимость:</span> {totalPrice} ₽</p>
                      <p><span className="text-black font-semibold">Магазины:</span> {uniqueMarketplace}</p>
                      <p>
                        <span className="text-black font-semibold">Почему именно это:</span>{' '}
                        {currentItem.reason.length > 100 ? currentItem.reason.slice(0, 100) + '…' : currentItem.reason}
                      </p>
                    </>
                  ) : (
                    <>
                      <p><span className="text-black font-semibold">Цена:</span> {currentItem.price} ₽</p>
                      <p><span className="text-black font-semibold">Магазин:</span> {currentItem.marketplace}</p>
                      <p><span className="text-black font-semibold">Почему это:</span> {currentItem.reason}</p>
                    </>
                  )}
                </div>

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
                    src={liked ? heartFilled : heartEmpty}
                    alt="heart"
                    className="w-5 h-5"
                  />
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-300 text-center mt-32">Скоро будет…</div>
            )}
          </div>
        ))}
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
