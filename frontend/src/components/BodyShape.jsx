import React, { useState, useContext } from 'react';
import { analyzeFigure } from '../services/api';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import { AuthContext } from './AuthContext';

const BODY_TYPE_DESCRIPTIONS_RU = {
  'RECTANGLE': 'Прямоугольный тип фигуры характеризуется прямым силуэтом, с похожими размерами плеч, талии и бёдер, что означает минимальную выраженность талии. Этот тип фигуры часто выглядит сбалансированным и обтекаемым, напоминая прямоугольник с почти одинаковой шириной в верхней, средней и нижней частях.',
  'TRIANGLE': 'Треугольный тип фигуры (также известный как "груша") отличается бёдрами, которые шире плеч и груди. Это создаёт силуэт, который более объёмен в нижней части, с выраженной талией, постепенно расширяющейся к бёдрам и бёдрам.',
  'HOURGLASS': 'Фигура "песочные часы" характеризуется сбалансированной грудью и бёдрами с значительно более узкой талией. Это создаёт изогнутый, симметричный силуэт, напоминающий песочные часы.',
  'INVERTED_TRIANGLE': 'Перевёрнутый треугольный тип фигуры отличается более широкими плечами и грудью по сравнению с бёдрами. Силуэт шире в верхней части и постепенно сужается к талии и бёдрам, создавая V-образную форму.',
  'OVAL': 'Овальный тип фигуры (также известный как "яблоко") отличается более широкой средней частью, где грудь и талия шире бёдер. Силуэт более округлый в середине, с менее выраженной талией, которая часто расположена выше.',
  'ROUND': 'Круглый тип фигуры характеризуется мягким, округлым силуэтом с равномерным распределением веса в средней части тела. Это создаёт более полный вид с менее выраженной талией.',
};

const formatTextWithBold = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold text-black">{boldText}</strong>;
    }
    return part;
  });
};

export default function BodyShape() {
  const [sex, setSex] = useState('Ж');
  const { user, setUser } = useContext(AuthContext);
  const [inputs, setInputs] = useState({ height: '', weight: '', waist: '', chest: '', hip: '' });
  const [errors, setErrors] = useState({});
  const [shapeResult, setShapeResult] = useState({ type: 'НЕ ОПРЕДЕЛЕН', meaning: '', clothes: '' });
  const [expanded, setExpanded] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const validate = () => {
    const newErrors = {};
    const height = parseFloat(inputs.height);
    const waist = parseFloat(inputs.waist);
    const chest = parseFloat(inputs.chest);
    const hip = parseFloat(inputs.hip);

    if (isNaN(height) || height <= 0 || height > 300) newErrors.height = 'Рост должен быть между 0-300 см';
    if (isNaN(waist) || waist <= 0 || waist > 300) newErrors.waist = 'Талия должна быть между 0-300 см';
    if (isNaN(chest) || chest <= 0 || chest > 300) newErrors.chest = 'Грудь должна быть между 0-300 см';
    if (isNaN(hip) || hip <= 0 || hip > 300) newErrors.hip = 'Бёдра должны быть между 0-300 см';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const analyze = async () => {
    if (!validate()) {
      setShapeResult({ type: 'НЕ ОПРЕДЕЛЕН', meaning: '', clothes: '' });
      return;
    }

    setIsLoading(true);
    try {
      const bodyData = {
        height: parseFloat(inputs.height),
        bust: parseFloat(inputs.chest),
        waist: parseFloat(inputs.waist),
        hips: parseFloat(inputs.hip)
      };

      const result = await analyzeFigure(bodyData);
      const russianBodyType = result.body_type || 'НЕ ОПРЕДЕЛЕН';
      const englishKey = Object.entries({
        'прямоугольник': 'RECTANGLE',
        'треугольник': 'TRIANGLE',
        'песочные часы': 'HOURGLASS',
        'перевернутый треугольник': 'INVERTED_TRIANGLE',
        'овал': 'OVAL',
        'круг': 'ROUND',
      }).find(([ru]) => ru === russianBodyType.toLowerCase())?.[1] || 'UNKNOWN';

      setShapeResult({
        type: russianBodyType.toUpperCase(),
        meaning: BODY_TYPE_DESCRIPTIONS_RU[englishKey] || 'Описание недоступно',
        clothes: result.recommendation || 'Рекомендации по одежде отсутствуют'
      });

      // Обновляем данные пользователя в контексте
      setUser({
        ...user,
        sex,
        height: inputs.height,
        weight: inputs.weight,
        bodyShape: russianBodyType.toUpperCase(),
      });
      localStorage.setItem('user', JSON.stringify({
        ...user,
        sex,
        height: inputs.height,
        weight: inputs.weight,
        bodyShape: russianBodyType.toUpperCase(),
      }));
    } catch (error) {
      alert('Ошибка анализа фигуры. Пожалуйста, попробуйте снова.');
      setShapeResult({ type: 'НЕ ОПРЕДЕЛЕН', meaning: '', clothes: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpanded(prev => (prev === section ? null : section));
  };

  return (
    <section id="shape" className="px-4 pb-12 font-noto font-light relative min-h-screen pt-[15vh]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-5xl font-comfortaa mb-4 tracking-wider">Узнай свой тип фигуры!</h2>
          <p className="text-sm md:text-2xl opacity-25">Заполни мерки и нажми "Анализировать" — мы определим твою фигуру!</p>
        </div>

        <div className="flex flex-col md:flex-row gap-16 md:gap-28 items-start mt-12">
          <div className="w-full md:w-[40%] max-w-[320px] mx-auto md:mx-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm md:text-lg w-[40%]">Пол</label>
                <div className="flex gap-2">
                  {['Ж', 'М'].map((s) => (
                    <button key={s} onClick={() => setSex(s)} className={`w-8 h-8 rounded-full border font-semibold text-sm ${sex === s ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}`}>{s}</button>
                  ))}
                </div>
              </div>

              {[{ label: 'Рост', name: 'height' }, { label: 'Вес', name: 'weight' }, { label: 'Талия', name: 'waist' }, { label: 'Грудь', name: 'chest' }, { label: 'Бёдра', name: 'hip' }].map(({ label, name }) => (
                <div key={name} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm md:text-lg w-[40%]">{label}</label>
                    <input type="number" value={inputs[name]} onChange={(e) => setInputs((prev) => ({ ...prev, [name]: e.target.value }))} placeholder="см" className="w-[60%] py-1.5 px-3 rounded-full border text-sm border-gray-300" />
                  </div>
                  {errors[name] && <p className="text-xs text-red-500 pl-[40%]">{errors[name]}</p>}
                </div>
              ))}

              <button onClick={analyze} disabled={isLoading} className="mt-6 w-full py-2 rounded-full font-medium transition bg-[rgba(221,221,221,0.35)] text-black disabled:opacity-50" style={{ backdropFilter: 'blur(4px)', boxShadow: '0 4px 4px rgba(0,0,0,0.25)' }}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Анализ...
                  </span>
                ) : 'Анализировать'}
              </button>

              <div className="mt-6 w-full flex justify-center">
                <div className="border border-gray-300 rounded-xl px-4 md:px-6 py-4 md:py-5 bg-white shadow-md w-full max-w-sm text-center transition-all">
                  <p className="mb-4 text-sm md:text-[15px] font-medium text-black">Как вам эта функция?</p>
                  <div className="flex justify-center gap-5">
                    <button onClick={() => setFeedback('like')} className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition duration-300 ${feedback === 'like' ? 'border-gray-400 ring-2 ring-gray-300 bg-white shadow-md' : 'hover:bg-gray-100 border-gray-300'}`} aria-label="Понравилось">
                      <img src={like} alt="Like" className="w-5 h-5" />
                    </button>
                    <button onClick={() => setFeedback('dislike')} className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition duration-300 ${feedback === 'dislike' ? 'border-gray-400 ring-2 ring-gray-300 bg-white shadow-md' : 'hover:bg-gray-100 border-gray-300'}`} aria-label="Не понравилось">
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
            </div>
          </div>

          <div className="w-full md:w-[60%]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base md:text-2xl">Ваш тип фигуры:</h3>
              <h4 className="text-neutral-600 text-lg md:text-2xl uppercase font-medium ml-auto">{shapeResult?.type || 'НЕ ОПРЕДЕЛЕН'}</h4>
            </div>

            {shapeResult.type !== 'НЕ ОПРЕДЕЛЕН' ? (
              ['meaning', 'clothes'].map((section) => {
                const isExpanded = expanded === section;
                const title = section === 'meaning' ? 'Что это значит?' : 'Какая одежда вам подходит?';
                const content = section === 'meaning' ? shapeResult.meaning : shapeResult.clothes;

                return (
                  <div key={section} className="mb-6 rounded-lg overflow-hidden border border-gray-200 bg-[rgba(221,221,221,0.35)]">
                    <div className="flex justify-between items-center cursor-pointer px-4 py-4 text-sm md:text-base text-black/50" onClick={() => toggleSection(section)}>
                      <span>{title}</span>
                      <span className="text-xl md:text-2xl">{isExpanded ? '−' : '+'}</span>
                    </div>
                    <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-4 pt-0 text-black text-sm md:text-base whitespace-pre-line">
                        {section === 'clothes' ? formatTextWithBold(content) : content}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 italic mt-6 text-sm md:text-base">
                {isLoading ? 'Анализ...' : 'Введите мерки и нажмите "Анализировать"'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
