import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { analyzeFigure, likeBodyShape, dislikeBodyShape } from '../services/api';

import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

const RUS_TO_EN_ENUM = {
  'прямоугольник': 'RECTANGLE',
  'треугольник': 'TRIANGLE',
  'песочные часы': 'HOURGLASS',
  'перевёрнутый треугольник': 'INVERTED_TRIANGLE',
  'перевернутый треугольник': 'INVERTED_TRIANGLE',
  'овал': 'OVAL',
  'круг': 'ROUND',
};

export default function BodyShape() {
  const { t, i18n } = useTranslation();

  const [sex, setSex] = useState('Ж');
  const [inputs, setInputs] = useState({ height: '', weight: '', waist: '', chest: '', hip: '' });
  const [errors, setErrors] = useState({});
  const [shapeResult, setShapeResult] = useState({ type: t('bodyShape.notDefined'), description: '', recommendation: '' });
  const [expanded, setExpanded] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  /* ---------- validation ---------- */
  const validate = () => {
    const e = {};
    const { height, waist, chest, hip } = inputs;

    const rangeErr = t('bodyShape.rangeErr');
    if (height <= 0 || height > 300) e.height = rangeErr;
    if (waist <= 0 || waist > 300) e.waist = rangeErr;
    if (chest <= 0 || chest > 300) e.chest = rangeErr;
    if (hip <= 0 || hip > 300) e.hip = rangeErr;

    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ---------- call backend ---------- */
  const analyze = async () => {
    if (!validate()) {
      setShapeResult({ type: t('bodyShape.notDefined'), description: '', recommendation: '' });
      return;
    }

    setIsLoading(true);
    try {
      const bodyData = {
        height: +inputs.height,
        bust: +inputs.chest,
        waist: +inputs.waist,
        hips: +inputs.hip,
      };

      const res = await analyzeFigure(bodyData);
      const langKey = i18n.language === 'ru' ? 'rus' : 'eng';
      const data = res.recommendation?.[langKey] || {};

      const ruLabel = res.body_type || '';
      const enEnum = RUS_TO_EN_ENUM[ruLabel.toLowerCase()] || ruLabel.toUpperCase();

      setShapeResult({
        type: enEnum,
        description: data.description || '',
        recommendation: data.recommendation || '',
      });
    } catch (err) {
      alert(t('bodyShape.error'));
      setShapeResult({ type: t('bodyShape.notDefined'), description: '', recommendation: '' });
    } finally {
      setIsLoading(false);
    }
  };


  const toggleSection = (s) => setExpanded((p) => (p === s ? null : s));

  const formatTextWithBold = (txt) =>
    txt.split(/(\*\*.*?\*\*)/g).map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} className="font-bold text-black">{p.slice(2, -2)}</strong>
        : p
    );

  
  const sendFeedback = async (type) => {
    try {
      if (type === 'like') await likeBodyShape();
      if (type === 'dislike') await dislikeBodyShape();
      setFeedback(type);
    } catch (e) {
      console.error(e);
    }
  };

  /* ---------- render ---------- */
  return (
    <section id="shape" className="px-4 pb-12 font-noto font-light relative min-h-screen pt-[15vh]">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-5xl font-comfortaa mb-4 tracking-wider">
            {t('bodyShape.title')}
          </h2>
          <p className="text-sm md:text-2xl opacity-25">
            {t('bodyShape.subtitle')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-16 md:gap-28 items-start mt-12">
          {/* ===== left column: form & feedback ===== */}
          <div className="w-full md:w-[40%] max-w-[320px] mx-auto md:mx-0">
            <div className="space-y-4">
              {/* sex toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm md:text-lg w-[40%]">{t('bodyShape.sex')}</label>
                <div className="flex gap-2">
                  {['Ж', 'М'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSex(s)}
                      className={`w-8 h-8 rounded-full border font-semibold text-sm ${
                        sex === s ? 'bg-black text-white' : 'bg-white text-black border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* numeric inputs */}
              {[
                { lbl: t('bodyShape.height'), name: 'height' },
                { lbl: t('bodyShape.weight'), name: 'weight' },
                { lbl: t('bodyShape.waist'),  name: 'waist'  },
                { lbl: t('bodyShape.chest'),  name: 'chest'  },
                { lbl: t('bodyShape.hip'),    name: 'hip'    },
              ].map(({ lbl, name }) => (
                <div key={name} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm md:text-lg w-[40%]">{lbl}</label>
                    <input
                      type="number"
                      value={inputs[name]}
                      onChange={(e) => setInputs((p) => ({ ...p, [name]: e.target.value }))}
                      placeholder="см"
                      className="w-[60%] py-1.5 px-3 rounded-full border text-sm border-gray-300"
                    />
                  </div>
                  {errors[name] && <p className="text-xs text-red-500 pl-[40%]">{errors[name]}</p>}
                </div>
              ))}

              {/* analyze button */}
              <button
                onClick={analyze}
                disabled={isLoading}
                className="mt-6 w-full py-2 rounded-full font-medium transition bg-[rgba(221,221,221,0.35)] text-black disabled:opacity-50"
                style={{ backdropFilter: 'blur(4px)', boxShadow: '0 4px 4px rgba(0,0,0,0.25)' }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('bodyShape.analyzing')}
                  </span>
                ) : t('bodyShape.analyze')}
              </button>

              {/* feedback box */}
              <div className="mt-6 w-full flex justify-center">
                <div className="border border-gray-300 rounded-xl px-4 md:px-6 py-4 md:py-5 bg-white shadow-md w-full max-w-sm text-center transition-all">
                  <p className="mb-4 text-sm md:text-[15px] font-medium text-black">
                    {t('bodyShape.feedbackQ')}
                  </p>
                  <div className="flex justify-center gap-5">
                    <button
                      onClick={() => setFeedback('like')}
                      className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition duration-300 ${
                        feedback === 'like'
                          ? 'border-gray-400 ring-2 ring-gray-300 bg-white shadow-md'
                          : 'hover:bg-gray-100 border-gray-300'
                      }`}
                      aria-label="Like"
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
                      aria-label="Dislike"
                    >
                      <img src={dislike} alt="Dislike" className="w-5 h-5" />
                    </button>
                  </div>
                  {feedback && (
                    <p className="mt-3 text-xs md:text-sm text-gray-600 italic transition-opacity duration-300">
                      {feedback === 'like' ? t('bodyShape.likeResp') : t('bodyShape.dislikeResp')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===== right column: results ===== */}
          <div className="w-full md:w-[60%]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base md:text-2xl">{t('bodyShape.yourType')}</h3>
              <h4 className="text-neutral-600 text-lg md:text-2xl uppercase font-medium ml-auto">
                {shapeResult.type || t('bodyShape.notDefined')}
              </h4>
            </div>

            {shapeResult.type !== t('bodyShape.notDefined') ? (
              ['description', 'recommendation'].map((sec) => {
                const isOpen = expanded === sec;
                const title  = sec === 'description' ? t('bodyShape.meaning') : t('bodyShape.clothes');
                const content = sec === 'recommendation'
                  ? formatTextWithBold(shapeResult.recommendation)
                  : shapeResult.description;

                return (
                  <div key={sec} className="mb-6 rounded-lg overflow-hidden border border-gray-200 bg-[rgba(221,221,221,0.35)]">
                    <div
                      className="flex justify-between items-center cursor-pointer px-4 py-4 text-sm md:text-base text-black/50"
                      onClick={() => toggleSection(sec)}
                    >
                      <span>{title}</span>
                      <span className="text-xl md:text-2xl">{isOpen ? '−' : '+'}</span>
                    </div>
                    <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-4 pt-0 text-black text-sm md:text-base whitespace-pre-line">{content}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 italic mt-6 text-sm md:text-base">
                {isLoading ? t('bodyShape.analyzing') : t('bodyShape.prompt')}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
