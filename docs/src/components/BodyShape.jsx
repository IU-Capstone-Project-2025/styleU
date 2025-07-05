import React, { useState } from 'react';
import { analyzeFigure } from '../services/api';

// Словарь для описаний фигур на русском
const BODY_TYPE_DESCRIPTIONS_RU = {
  'RECTANGLE': 'Прямоугольный тип фигуры характеризуется прямым силуэтом, с похожими размерами плеч, талии и бёдер, что означает минимальную выраженность талии. Этот тип фигуры часто выглядит сбалансированным и обтекаемым, напоминая прямоугольник с почти одинаковой шириной в верхней, средней и нижней частях.',
  'TRIANGLE': 'Треугольный тип фигуры (также известный как "груша") отличается бёдрами, которые шире плеч и груди. Это создаёт силуэт, который более объёмен в нижней части, с выраженной талией, постепенно расширяющейся к бёдрам и бёдрам.',
  'HOURGLASS': 'Фигура "песочные часы" характеризуется сбалансированной грудью и бёдрами с значительно более узкой талией. Это создаёт изогнутый, симметричный силуэт, напоминающий песочные часы.',
  'INVERTED_TRIANGLE': 'Перевёрнутый треугольный тип фигуры отличается более широкими плечами и грудью по сравнению с бёдрами. Силуэт шире в верхней части и постепенно сужается к талии и бёдрам, создавая V-образную форму.',
  'OVAL': 'Овальный тип фигуры (также известный как "яблоко") отличается более широкой средней частью, где грудь и талия шире бёдер. Силуэт более округлый в середине, с менее выраженной талией, которая часто расположена выше.',
  'ROUND': 'Круглый тип фигуры характеризуется мягким, округлым силуэтом с равномерным распределением веса в средней части тела. Это создаёт более полный вид с менее выраженной талией.',
};

// Функция для преобразования **текст** в жирный шрифт
const formatTextWithBold = (text) => {
  if (!text) return null;
  
  // Разбиваем текст на части, разделенные **
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Убираем ** и оборачиваем в strong
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold text-black">{boldText}</strong>;
    }
    return part;
  });
};

export default function BodyShape() {
  const [sex, setSex] = useState('Ж');
  const [inputs, setInputs] = useState({
    height: '',
    weight: '',
    waist: '',
    chest: '',
    hip: '',
  });
  const [errors, setErrors] = useState({});
  const [shapeResult, setShapeResult] = useState({
    type: 'НЕ ОПРЕДЕЛЕН',
    meaning: '',
    clothes: ''
  });
  const [expanded, setExpanded] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const height = parseFloat(inputs.height);
    const waist = parseFloat(inputs.waist);
    const chest = parseFloat(inputs.chest);
    const hip = parseFloat(inputs.hip);

    if (isNaN(height) || height <= 0 || height > 300) {
      newErrors.height = 'Рост должен быть между 0-300 см';
    }
    if (isNaN(waist) || waist <= 0 || waist > 300) {
      newErrors.waist = 'Талия должна быть между 0-300 см';
    }
    if (isNaN(chest) || chest <= 0 || chest > 300) {
      newErrors.chest = 'Грудь должна быть между 0-300 см';
    }
    if (isNaN(hip) || hip <= 0 || hip > 300) {
      newErrors.hip = 'Бёдра должны быть между 0-300 см';
    }

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
      console.log("Ответ от сервиса:", result);

      // Используем тип фигуры напрямую из ответа (на русском)
      const russianBodyType = result.body_type || 'НЕ ОПРЕДЕЛЕН';
      
      // Получаем английский ключ для описания
      const englishKey = Object.entries({
        'прямоугольник': 'RECTANGLE',
        'треугольник': 'TRIANGLE',
        'песочные часы': 'HOURGLASS',
        'перевернутый треугольник': 'INVERTED_TRIANGLE',
        'овал': 'OVAL',
        'круг': 'ROUND',
      }).find(([ru]) => ru === russianBodyType.toLowerCase())?.[1] || 'UNKNOWN';

      // Устанавливаем результат
      setShapeResult({
        type: russianBodyType.toUpperCase(),
        meaning: BODY_TYPE_DESCRIPTIONS_RU[englishKey] || 'Описание недоступно',
        clothes: result.recommendation || 'Рекомендации по одежде отсутствуют'
      });
    } catch (error) {
      console.error('Ошибка API:', error);
      
      let errorMessage = 'Ошибка анализа фигуры. Пожалуйста, попробуйте снова.';
      
      if (error.response) {
        if (error.response.status === 422) {
          if (Array.isArray(error.response.data?.detail)) {
            const serverErrors = error.response.data.detail.map(err => 
              `${err.loc.join('.')}: ${err.msg}`
            ).join('\n');
            errorMessage = `Неверные данные:\n${serverErrors}`;
          } else {
            errorMessage = `Ошибка валидации: ${error.response.data?.detail}`;
          }
        } 
        else if (error.response.status === 500) {
          errorMessage = "Ошибка сервера: " + (error.response.data?.detail || "Внутренняя ошибка сервера");
        }
      } 
      else if (error.request) {
        errorMessage = "Нет ответа от сервера. Проверьте работу бэкенда.";
      }
      else {
        errorMessage = error.message || "Произошла неизвестная ошибка";
      }
      
      alert(errorMessage);
      setShapeResult({ type: 'НЕ ОПРЕДЕЛЕН', meaning: '', clothes: '' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSection = (section) => {
    setExpanded(prev => (prev === section ? null : section));
  };

  return (
    <section id="shape" className="px-4 pb-12 font-noto font-light relative min-h-screen" style={{ paddingTop: '15vh' }}>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-comfortaa font-normal mb-4 tracking-wider">
            Узнай свой тип фигуры!
          </h2>
          <p className="text-base md:text-2xl opacity-25">
            Заполни свои мерки, нажми "Анализировать", а мы расскажем тебе о твоем типе фигуры!
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mt-8">
          {/* Левая часть - Форма */}
          <div className="w-full md:w-1/2 space-y-4">
            {/* Пол - Inline */}
            <div className="flex items-center justify-between">
              <label className="text-lg w-[40%]">Пол</label>
              <div className="flex gap-3 w-[60%]">
                {['Ж', 'М'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={`w-8 h-8 rounded-full border text-sm font-semibold ${
                      sex === s ? 'bg-black text-white' : 'bg-white text-black border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Поля ввода */}
            {[
              { label: 'Рост', name: 'height', placeholder: 'см' },
              { label: 'Вес', name: 'weight', placeholder: 'кг' },
              { label: 'Обхват талии', name: 'waist', placeholder: 'см' },
              { label: 'Обхват груди', name: 'chest', placeholder: 'см' },
              { label: 'Обхват бёдер', name: 'hip', placeholder: 'см' },
            ].map(({ label, name, placeholder }) => (
              <div key={name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-lg w-[40%]">{label}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs[name]}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                    className="w-[60%] py-2 px-4 border border-gray-300 rounded-full text-sm"
                    placeholder={placeholder}
                    disabled={isLoading}
                  />
                </div>
                {errors[name] && (
                  <p className="text-red-500 text-xs pl-[40%]">{errors[name]}</p>
                )}
              </div>
            ))}

            {/* Кнопка Анализировать */}
            <button
              onClick={analyze}
              disabled={isLoading}
              className="mt-6 w-[75%] mx-auto block py-3 rounded-full bg-[rgba(221,221,221,0.35)] text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backdropFilter: 'blur(4px)',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              }}
            >
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
          </div>

          {/* Правая часть - Результаты */}
          <div className="w-full md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl md:text-2xl">Ваш тип фигуры:</h3>
              <h4 className="text-red-500 text-2xl uppercase font-medium ml-auto">
                {shapeResult?.type || 'НЕ ОПРЕДЕЛЕН'}
              </h4>
            </div>

            {shapeResult.type !== 'НЕ ОПРЕДЕЛЕН' ? (
              <>
                {['meaning', 'clothes'].map((section) => {
                  const isExpanded = expanded === section;
                  const title =
                    section === 'meaning'
                      ? 'Что это значит?'
                      : 'Какая одежда вам подходит?';
                  const content =
                    section === 'meaning'
                      ? shapeResult.meaning
                      : shapeResult.clothes;

                  return (
                    <div key={section} className="mb-6 rounded-lg overflow-hidden border border-gray-200 bg-[rgba(221,221,221,0.35)] transition-all duration-500">
                      <div 
                        className={`flex justify-between items-center cursor-pointer px-4 py-4 transition-all duration-300`}
                        onClick={() => toggleSection(section)}
                        style={{
                          userSelect: 'none',
                          color: 'rgba(0,0,0,0.3)'
                        }}
                      >
                        <span>{title}</span>
                        <span className="text-2xl select-none" style={{ color: 'rgba(0,0,0,0.3)' }}>
                          {isExpanded ? '−' : '+'}
                        </span>
                      </div>
                      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-4 pt-0 text-black whitespace-pre-line">
                          {section === 'clothes' 
                            ? formatTextWithBold(content) 
                            : content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-gray-400 italic mt-6">
                {isLoading ? 'Идёт анализ вашей фигуры...' : 'Введите свои мерки и нажмите "Анализировать"'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}