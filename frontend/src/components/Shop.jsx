import React, { useState, useRef, useEffect } from 'react';
import OutfitCarousel from './OutfitCarousel';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import { useTranslation } from 'react-i18next';
import { likeShop, dislikeShop, suggestOutfits } from '../services/api';

function Shop() {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [size, setSize] = useState('');
  const [style, setStyle] = useState('');
  const [priceRange, setPriceRange] = useState(['', '']);
  const [extraInfo, setExtraInfo] = useState('');
  const [hoveringPrice, setHoveringPrice] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [outfits, setOutfits] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const resultRef = useRef(null);
  const queryRef = useRef(null);
  const extraInfoRef = useRef(null);

  const isFilled =
    query.trim() &&
    size &&
    style &&
    priceRange[0] &&
    priceRange[1] &&
    extraInfo.trim();

  useEffect(() => {
    if (queryRef.current) {
      queryRef.current.style.height = 'auto';
      queryRef.current.style.height = queryRef.current.scrollHeight + 'px';
    }
    if (extraInfoRef.current) {
      extraInfoRef.current.style.height = 'auto';
      extraInfoRef.current.style.height = extraInfoRef.current.scrollHeight + 'px';
    }
  }, [query, extraInfo]);

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!isFilled) return;

    setIsLoading(true);
    try {
      const formData = {
        query: String(query),
        size: String(size),
        price_min: String(priceRange[0]),
        price_max: String(priceRange[1]),
        extra_info: String(extraInfo),
        style: String(style),
      };

      const token = localStorage.getItem('token');
      const res = await suggestOutfits(formData, token);
      setOutfits(res.outfits || []);
      setMessages(res.messages || []);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error('Error suggesting outfits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    setFeedback('like');
    try {
      await likeShop();
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleDislike = async () => {
    setFeedback('dislike');
    try {
      await dislikeShop();
    } catch (err) {
      console.error('Dislike error:', err);
    }
  };

  const sharedInputStyle =
    'bg-[#eeeeee] backdrop-blur-md text-sm px-4 py-3 rounded-xl min-h-[3rem] w-full resize-none outline-none placeholder-gray-500 transition-all duration-300 ease-in-out overflow-hidden focus:ring-2 focus:ring-black/30 hover:scale-[1.02] hover:ring-black/10 shadow-md font-["Noto Sans",sans-serif]';

  const sharedSelectStyle =
    'bg-[#eeeeee] text-sm px-4 py-3 rounded-xl w-full outline-none transition focus:ring-2 focus:ring-black/30 shadow-md font-["Noto Sans",sans-serif] cursor-pointer';

  const errorText = 'text-xs text-red-500 mt-1';
  const errorField = 'border border-red-400';

  return (
    <>
      <section className="min-h-screen px-4 pb-12 font-noto font-light pt-32">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-comfortaa font-normal mb-4 tracking-wider">
            {t('shop.title')}
          </h2>
          <p className="text-base md:text-2xl opacity-25">{t('shop.subtitle')}</p>
        </div>

        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-start gap-3">
          {/* Query */}
          <div className="flex-shrink-0 w-52">
            <textarea
              ref={queryRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('shop.query')}
              className={`${sharedInputStyle} ${submitted && !query ? errorField : ''}`}
              rows={1}
            />
            {submitted && !query && <p className={errorText}>{t('shop.fillField')}</p>}
          </div>

          {/* Size */}
          <div className="flex-shrink-0 w-52">
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className={`${sharedSelectStyle} ${submitted && !size ? errorField : ''}`}
            >
              <option value="">{t('shop.size')}</option>
              {['XS', 'S', 'M', 'L', 'XL', '44', '46', '48', '50'].map((sz) => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
            {submitted && !size && <p className={errorText}>{t('shop.fillField')}</p>}
          </div>

          {/* Style */}
          <div className="flex-shrink-0 w-52">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className={`${sharedSelectStyle} ${submitted && !style ? errorField : ''}`}
            >
              <option value="">{t('shop.style')}</option>
              {['casual', 'office', 'sporty', 'romantic', 'edgy'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {submitted && !style && <p className={errorText}>{t('shop.fillField')}</p>}
          </div>

          {/* Price Dropdown */}
          <div
            className="flex-shrink-0 w-52 relative"
            onMouseEnter={() => setHoveringPrice(true)}
            onMouseLeave={() => setHoveringPrice(false)}
          >
            <div
              className={`${sharedInputStyle} cursor-pointer text-left ${
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
              <label className="text-xs block mb-1 text-gray-700">{t('shop.min')}</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
                className="mb-2 w-full px-2 py-1 rounded text-sm bg-white focus:ring-2 focus:ring-black/30 outline-none"
              />
              <label className="text-xs block mb-1 text-gray-700">{t('shop.max')}</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                className="w-full px-2 py-1 rounded text-sm bg-white focus:ring-2 focus:ring-black/30 outline-none"
              />
            </div>
            {submitted && (!priceRange[0] || !priceRange[1]) && (
              <p className={errorText}>{t('shop.fillField')}</p>
            )}
          </div>

          {/* Extra Info */}
          <div className="flex-shrink-0 w-52">
            <textarea
              ref={extraInfoRef}
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              placeholder={t('shop.extra')}
              className={`${sharedInputStyle} ${submitted && !extraInfo ? errorField : ''}`}
              rows={1}
            />
            {submitted && !extraInfo && <p className={errorText}>{t('shop.fillField')}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex-shrink-0 w-32 h-[48px] mt-1">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-black text-white text-sm w-full h-full rounded-2xl hover:opacity-90 transition flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  {t('shop.searching')}
                </>
              ) : (
                t('shop.search')
              )}
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-12 flex justify-center">
          <div className="border border-gray-300 rounded-xl px-6 py-5 bg-white shadow-md w-full max-w-sm text-center transition-all">
            <p className="mb-4 text-sm font-medium text-black">{t('shop.feedbackQ')}</p>
            <div className="flex justify-center gap-5">
              <button
                onClick={handleLike}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition ${
                  feedback === 'like' ? 'border-gray-400 ring-2 ring-gray-300 bg-white shadow-md' : 'hover:bg-gray-100 border-gray-300'
                }`}
              >
                <img src={like} alt="Like" className="w-5 h-5" />
              </button>
              <button
                onClick={handleDislike}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition ${
                  feedback === 'dislike' ? 'border-gray-400 ring-2 ring-gray-300 bg-white shadow-md' : 'hover:bg-gray-100 border-gray-300'
                }`}
              >
                <img src={dislike} alt="Dislike" className="w-5 h-5" />
              </button>
            </div>
            {feedback && (
              <p className="mt-3 text-xs text-gray-600 italic transition-opacity duration-300">
                {feedback === 'like' ? t('shop.likeResp') : t('shop.dislikeResp')}
              </p>
            )}
          </div>
        </div>
      </section>

      <div ref={resultRef}>
        <OutfitCarousel outfits={outfits} messages={messages} carousel3StyleOnly={true} />
      </div>
    </>
  );
}

export default Shop;
