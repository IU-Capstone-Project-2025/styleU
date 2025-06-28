import React, { useState } from 'react';

export default function BodyShape() {
  const [sex, setSex] = useState('F');
  const [inputs, setInputs] = useState({
    height: '',
    weight: '',
    waist: '',
    chest: '',
    hip: '',
  });
  const [errors, setErrors] = useState({});
  const [shapeResult, setShapeResult] = useState({
    type: 'UNKNOWN',
    meaning: '',
    clothes: ''
  });
  const [expanded, setExpanded] = useState(null);

  const validate = () => {
    const newErrors = {};
    const height = parseInt(inputs.height);
    const weight = parseInt(inputs.weight);
    const waist = parseInt(inputs.waist);
    const chest = parseInt(inputs.chest);
    const hip = parseInt(inputs.hip);

    if (isNaN(height) || height < 150 || height > 200) {
      newErrors.height = 'Height should be between 150-200 cm';
    }
    if (isNaN(weight) || weight < 40 || weight > 150) {
      newErrors.weight = 'Weight should be between 40-150 kg';
    }
    if (isNaN(waist) || waist < 50 || waist > 150) {
      newErrors.waist = 'Waist should be between 50-150 cm';
    }
    if (isNaN(chest) || chest < 50 || chest > 150) {
      newErrors.chest = 'Chest should be between 50-150 cm';
    }
    if (isNaN(hip) || hip < 50 || hip > 150) {
      newErrors.hip = 'Hip should be between 50-150 cm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const analyze = () => {
    if (!validate()) {
      setShapeResult({ type: 'UNKNOWN', meaning: '', clothes: '' });
      return;
    }

    setShapeResult({
      type: 'RECTANGLE',
      meaning: 'A rectangle body shape is characterized by a straight silhouette, with similar shoulder, waist, and hip measurements, meaning theres little to no waist definition. This body type often has a balanced and streamlined look, resembling a rectangle with an almost equal width across the top, middle, and bottom. ',
      clothes: 'For rectangle body shapes, clothing that creates curves and emphasizes the waist is key. This can be achieved by incorporating pieces that cinch at the waist, add volume to the upper or lower body, and create a more defined silhouette. Specific clothing styles that work well include belted dresses, wrap tops, high-waisted skirts and pants, peplum tops, and A-line skirts.'
    });
  };

  const toggleSection = (section) => {
    setExpanded(prev => (prev === section ? null : section));
  };

  return (
    <section id="shape" className="px-4 pb-12 font-anaheim relative min-h-screen" style={{ paddingTop: '15vh' }}>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-comfortaa font-normal mb-4 tracking-wider">
            Discover your body shape!
          </h2>
          <p className="text-base md:text-2xl opacity-25">
            Just fill in your measurements and press analyze.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mt-8">
          {/* Left - Form */}
          <div className="w-full md:w-1/2 space-y-4">
            {/* Sex - Inline */}
            <div className="flex items-center justify-between">
              <label className="text-lg w-[40%]">Sex</label>
              <div className="flex gap-3 w-[60%]">
                {['F', 'M'].map((s) => (
                  <button
                    key={s}
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

            {/* Input fields inline */}
            {[
              { label: 'Hight', name: 'height', placeholder: 'cm' },
              { label: 'Weight', name: 'weight', placeholder: 'kg' },
              { label: 'Waist girth', name: 'waist', placeholder: 'cm' },
              { label: 'Chest girth', name: 'chest', placeholder: 'cm' },
              { label: 'Hip girth', name: 'hip', placeholder: 'cm' },
            ].map(({ label, name, placeholder }) => (
              <div key={name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-lg w-[40%]">{label}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inputs[name]}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                    className="w-[60%] py-2 px-4 border border-gray-300 rounded-full text-sm"
                    placeholder={placeholder}
                  />
                </div>
                {errors[name] && (
                  <p className="text-red-500 text-xs pl-[40%]">{errors[name]}</p>
                )}
              </div>
            ))}

            {/* Centered Analyze Button */}
            <button
              onClick={analyze}
              className="mt-6 w-[75%] mx-auto block py-3 rounded-full bg-[rgba(221,221,221,0.35)] text-black font-medium"
              style={{
                backdropFilter: 'blur(4px)',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              }}
            >
              Analyze
            </button>
          </div>

          {/* Right - Results */}
          <div className="w-full md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl md:text-2xl">Your body shape is</h3>
              <h4 className="text-red-500 text-2xl uppercase font-medium ml-auto">
                {shapeResult?.type || 'UNKNOWN'}
              </h4>
            </div>

            {shapeResult.type !== 'UNKNOWN' ? (
              <>
                {['meaning', 'clothes'].map((section) => {
                  const isExpanded = expanded === section;
                  const title =
                    section === 'meaning'
                      ? 'What does it mean?'
                      : 'What clothes suit you the best?';
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
                        <div className="p-4 pt-0 text-black">
                          {content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-gray-400 italic mt-6">
                Add your measurements and press Analyze to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
