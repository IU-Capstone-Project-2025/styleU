import React, { useState, useRef, useEffect } from 'react';
import OutfitCarousel from './OutfitCarousel';
import Avatar from './Avatar';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

function Shop() {
  const [occasion, setOccasion] = useState('');
  const [priceRange, setPriceRange] = useState(['', '']);
  const [location, setLocation] = useState('');
  const [otherInfo, setOtherInfo] = useState('');
  const [hoveringPrice, setHoveringPrice] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const resultRef = useRef(null);
  const occasionRef = useRef(null);
  const locationRef = useRef(null);
  const otherInfoRef = useRef(null);

  const autoGrow = (ref) => {
    if (ref?.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    autoGrow(occasionRef);
    autoGrow(locationRef);
    autoGrow(otherInfoRef);
  }, [occasion, location, otherInfo]);

  const sharedTextarea =
    'bg-[#eeeeee] backdrop-blur-md text-sm px-4 py-3 rounded-xl min-h-[3rem] w-full resize-none outline-none placeholder-gray-500 transition-all duration-300 ease-in-out overflow-hidden focus:ring-2 focus:ring-black/30 hover:scale-[1.02] hover:ring-black/10 shadow-md font-["Noto Sans",sans-serif]';

  const isFilled =
    occasion.trim() && location.trim() && priceRange[0] && priceRange[1];

  const handleSubmit = () => {
    setSubmitted(true);
    if (isFilled) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const errorText = 'text-xs text-red-500 mt-1';
  const errorField = 'border border-red-400';

  return (
    <>
      <section className="min-h-screen px-4 pb-12 font-noto font-light pt-32">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-comfortaa font-normal mb-4 tracking-wider">
            Магазин StyleU
          </h2>
          <p className="text-base md:text-2xl opacity-25">
            Персональные подборки под твой стиль и случай
          </p>
        </div>

        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-start gap-3">
          {/* Form Fields */}
          <div className="flex-shrink-0 w-52">
            <textarea
              ref={occasionRef}
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Событие"
              className={`${sharedTextarea} ${submitted && !occasion ? errorField : ''}`}
              rows={1}
            />
            {submitted && !occasion && <p className={errorText}>заполните окно</p>}
          </div>

          <div
            className="flex-shrink-0 w-52 relative"
            onMouseEnter={() => setHoveringPrice(true)}
            onMouseLeave={() => setHoveringPrice(false)}
          >
            <div
              className={`${sharedTextarea} cursor-pointer text-left ${
                submitted && (!priceRange[0] || !priceRange[1]) ? errorField : ''
              }`}
            >
              {priceRange[0] || 0}₽ - {priceRange[1] || 0}₽
            </div>

            <div
              className={`transition-all duration-300 overflow-hidden bg-[#f0f0f0] rounded-xl shadow-lg mt-2 px-3 py-2 ${
                hoveringPrice ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              } absolute w-full z-10`}
            >
              <label className="text-xs block mb-1 text-gray-700">От (₽)</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
                className="mb-2 w-full px-2 py-1 rounded text-sm bg-white focus:ring-2 focus:ring-black/30 outline-none"
              />
              <label className="text-xs block mb-1 text-gray-700">До (₽)</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                className="w-full px-2 py-1 rounded text-sm bg-white focus:ring-2 focus:ring-black/30 outline-none"
              />
            </div>
            {submitted && (!priceRange[0] || !priceRange[1]) && (
              <p className={errorText}>заполните окно</p>
            )}
          </div>

          <div className="flex-shrink-0 w-52">
            <textarea
              ref={locationRef}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Локация"
              className={`${sharedTextarea} ${submitted && !location ? errorField : ''}`}
              rows={1}
            />
            {submitted && !location && <p className={errorText}>заполните окно</p>}
          </div>

          <div className="flex-shrink-0 w-52">
            <textarea
              ref={otherInfoRef}
              value={otherInfo}
              onChange={(e) => setOtherInfo(e.target.value)}
              placeholder="Доп. информация"
              className={`${sharedTextarea} ${submitted && !otherInfo ? errorField : ''}`}
              rows={1}
            />
            {submitted && !otherInfo && <p className={errorText}>заполните окно</p>}
          </div>

          <div className="flex-shrink-0 w-32 h-[48px]">
            <button
              onClick={handleSubmit}
              className="bg-black text-white text-sm w-full h-full rounded-2xl hover:opacity-90 transition"
            >
              Искать!
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-12 flex justify-center">
          <div className="border border-gray-300 rounded-xl px-4 md:px-6 py-4 md:py-5 bg-white shadow-md w-full max-w-sm text-center transition-all">
            <p className="mb-4 text-sm md:text-[15px] font-medium text-black">Как вам эта функция?</p>
            <div className="flex justify-center gap-5">
              <button
                onClick={() => setFeedback('like')}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition duration-300 ${
                  feedback === 'like'
                    ? 'border-gray-400 ring-2 ring-gray-300 bg-white shadow-md'
                    : 'hover:bg-gray-100 border-gray-300'
                }`}
                aria-label="Понравилось"
              >
                <img src={like} alt="Like" className="w-5 h-5" />
              </button>
              <button
                onClick={() => setFeedback('dislike')}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition duration-300 ${
                  feedback === 'dislike'
                    ? 'border-gray-400 ring-2 ring-gray-300 bg-white shadow-md'
                    : 'hover:bg-gray-100 border-gray-300'
                }`}
                aria-label="Не понравилось"
              >
                <img src={dislike} alt="Dislike" className="w-5 h-5" />
              </button>
            </div>
            {feedback && (
              <p className="mt-3 text-xs md:text-sm text-gray-600 italic transition-opacity duration-300">
                {feedback === 'like' ? 'Спасибо за отзыв!' : 'Жаль, что не понравилось'}
              </p>
            )}
          </div>
        </div>
      </section>

      <div >
            <Avatar/>
      </div>
      <div ref={resultRef}>
        <OutfitCarousel />
      </div>
    </>
  );
}

export default Shop;
