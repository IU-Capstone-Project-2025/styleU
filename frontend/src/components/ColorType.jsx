import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { analyzeColor, likeColorType, dislikeColorType } from '../services/api';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import bgImage from '../assets/photo-background.png';

export default function ColorType() {
  const { t, i18n } = useTranslation();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [colorType, setColorType] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('color_image');
    const savedResult = localStorage.getItem('color_result');
    if (savedImage && savedResult) {
      setImage(savedImage);
      setColorType(JSON.parse(savedResult));
    }
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setColorType(null);
      setExpandedSection(null);
      setFeedback(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imageFile) return;
    setLoading(true);
    try {
      const result = await analyzeColor(imageFile);
      const langKey = i18n.language === 'ru' ? 'rus' : 'eng';
      const data = result.recommendation?.[langKey] || {};
      const rec = data.recommendation || {};

      const parsedResult = {
        type: result.color_type?.toUpperCase() || t('colorType.notDefined'),
        meaning: rec.about || '',
        suitableColors: {
          description: rec.suitable_colors?.description || '',
          palette: rec.suitable_colors?.palette || [],
        },
        unsuitableColors: {
          description: rec.unsuitable_colors?.description || '',
          palette: rec.unsuitable_colors?.palette || [],
        },
      };

      setColorType(parsedResult);
      localStorage.setItem('color_image', image);
      localStorage.setItem('color_result', JSON.stringify(parsedResult));
    } catch (err) {
      console.error(err);
      alert(t('colorType.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const sendFeedback = async (type) => {
    try {
      if (type === 'like') await likeColorType();
      if (type === 'dislike') await dislikeColorType();
      setFeedback(type);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="color" className="px-4 pb-12 font-noto font-light relative min-h-screen pt-[15vh]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-5xl font-comfortaa mb-4 tracking-wider">{t('colorType.title')}</h2>
          <p className="text-sm md:text-2xl opacity-25">{t('colorType.description')}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-16 md:gap-28 items-start mt-12">
          <div className="w-full md:w-[40%] flex flex-col items-center md:items-start">
            <div className="w-[90%] max-w-[320px]">
              <label htmlFor="file-upload" className="cursor-pointer w-full block">
                {!image ? (
                  <div
                    className="border border-black rounded-lg w-full aspect-square flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${bgImage})`, backgroundSize: '120%' }}
                  >
                    <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 text-xs md:text-sm font-semibold">{t('colorType.selectFile')}</span>
                  </div>
                ) : (
                  <div className="border border-black rounded-lg overflow-hidden w-full aspect-square">
                    <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
                  </div>
                )}
              </label>
              <input id="file-upload" type="file" accept="image/*" onChange={handleUpload} className="hidden" />


              <button
                onClick={analyzeImage}
                disabled={!image || loading}
                className={`mt-6 w-full py-2 md:py-3 rounded-full font-medium transition ${
                  image ? 'bg-[rgba(221,221,221,0.35)] text-black hover:bg-[rgba(221,221,221,0.35)]' : 'cursor-not-allowed'
                }`}
                style={{ backdropFilter: 'blur(4px)', boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('colorType.analyzing')}
                  </span>
                ) : (
                  t('colorType.analyze')
                )}
              </button>

              {/* Feedback Section */}
              {colorType && (
                <div className="mt-6 w-full flex justify-center">
                  <div className="border border-gray-300 rounded-xl px-4 md:px-6 py-4 md:py-5 bg-white shadow-md w-full max-w-sm text-center transition-all">
                    <p className="mb-4 text-sm md:text-[15px] font-medium text-black">{t('colorType.feedbackQuestion')}</p>
                    <div className="flex justify-center gap-5">
                      <button
                        onClick={() => sendFeedback('like')}
                        className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition duration-300 ${
                          feedback === 'like' ? 'border-gray-400 ring-2 ring-gray-300 bg-white shadow-md' : 'hover:bg-gray-100 border-gray-300'
                        }`}
                        aria-label="Like"
                      >
                        <img src={like} alt="Like" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => sendFeedback('dislike')}
                        className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition duration-300 ${
                          feedback === 'dislike' ? 'border-gray-400 ring-2 ring-gray-300 bg-white shadow-md' : 'hover:bg-gray-100 border-gray-300'
                        }`}
                        aria-label="Dislike"
                      >
                        <img src={dislike} alt="Dislike" className="w-5 h-5" />
                      </button>
                    </div>
                    {feedback && (
                      <p className="mt-3 text-xs md:text-sm text-gray-600 italic transition-opacity duration-300">
                        {feedback === 'like' ? t('colorType.likeResponse') : t('colorType.dislikeResponse')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Color Result */}
          <div className="w-full md:w-[60%] flex flex-col items-end space-y-6">
            <div className="w-full max-w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base md:text-2xl">{t('colorType.yourType')}</h3>
                <h4 className="text-neutral-600 text-lg md:text-2xl uppercase font-medium ml-auto text-right">
                  {colorType?.type || t('colorType.notDefined')}
                </h4>
              </div>

              {colorType ? (
                ['meaning', 'suitableColors', 'unsuitableColors'].map((section) => {
                  const isExpanded = expandedSection === section;
                  const title = t(`colorType.${section === 'meaning' ? 'meaning' : section === 'suitable' ? 'suitable' : 'unsuitable'}`);
                  const content =
                    section === 'meaning' ? (
                      <div className="p-4 pt-0 text-black text-sm md:text-base">{colorType.meaning}</div>
                    ) : (
                      <div className="p-4 pt-0 text-black text-sm md:text-base">
                        <p className="mb-1 mt-1">{colorType[section].description}</p>
                        <div className="flex gap-3 mt-3 flex-wrap">
                          {colorType[section].palette.map((color, i) => (
                            <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded border border-gray-200 shadow-sm" style={{ backgroundColor: color }} title={color} />
                          ))}
                        </div>
                      </div>
                    );

                  return (
                    <div key={section} className="mb-6 rounded-lg overflow-hidden border border-gray-200 bg-[rgba(221,221,221,0.35)]">
                      <div
                        className="flex justify-between items-center cursor-pointer px-4 py-4 text-sm md:text-base text-black/50"
                        onClick={() => toggleSection(section)}
                      >
                        <span>{title}</span>
                        <span className="text-xl md:text-2xl select-none">{isExpanded ? '−' : '+'}</span>
                      </div>
                      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        {content}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400 italic mt-6 text-sm md:text-base">
                  {image ? t('colorType.analyzeMsg') : t('colorType.noImageMsg')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
