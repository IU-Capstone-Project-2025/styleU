import React from 'react';

export default function Favorites() {
  // Пример данных (заменить на реальные из контекста или API)
  const favorites = [
    {
      id: 1,
      image: 'https://images.wbstatic.net/big/new/2000/01/01/0000000001-1.jpg',
      title: 'Черные мюли',
      marketplace: 'wildberries',
      price: 2000,
    },
  ];

  return (
    <section className="min-h-screen px-4 pb-12 font-noto font-light pt-32">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-comfortaa font-normal mb-4 tracking-wider">
          Избранные товары
        </h2>
      </div>
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-start gap-3">
        {favorites.length === 0 ? (
          <div className="text-gray-400 text-xl mt-20">Нет избранных товаров</div>
        ) : (
          favorites.map((item) => (
            <div key={item.id} className="bg-[#ededed] rounded-2xl p-8 flex flex-col items-center w-[340px] min-h-[340px] shadow-md">
              <img src={item.image} alt={item.title} className="w-40 h-40 object-cover rounded-xl mb-6" />
              <div className="text-lg font-noto font-light mb-2">{item.title}</div>
              <div className="text-gray-500 text-sm mb-1">Market: {item.marketplace}</div>
              <div className="text-gray-500 text-sm mb-1">Price: {item.price} ₽</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
} 