import React, { useState } from 'react';

export default function ColorType() {
  const [image, setImage] = useState(null);
  const [colorType, setColorType] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);

  const colorData = {
    type: "DEEP AUTUMN",
    meaning: "Deep Autumn in color analysis refers to a color season that is characterized by a dark, warm palette with high contrast.",
    suitableColors: {
      description: "Deep Autumn individuals thrive in rich, deep, and warm colors that evoke the essence of fall. Their palette includes shades like deep teal, warm navy, forest green, olive green, deep aubergine, warm plum, maroon, warm rose, brick red, dark mauve, chocolate brown, dark olive, and warm taupe.",
      palette: ['#2C4A52', '#537072', '#8E9B97', '#F4EBDB', '#D4B483', '#A26769']
    },
    unsuitableColors: {
      description: "Deep Autumns are light and cool hues, as these can wash out their natural warmth and contrast. They should generally avoid pale pastels, icy blues and grays, and muted shades",
      palette: ['#F8F4E3', '#D8D8D8', '#A5D8FF', '#C8E7F5', '#E8D5C4', '#F3D7D7']
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setColorType(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = () => {
    if (!image) return;

    setLoading(true);
    setTimeout(() => {
      setColorType(colorData);
      setLoading(false);
    }, 1500);
  };

  const toggleSection = (section) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  return (
    <section 
      id="color" 
      className="px-4 pb-12 font-anaheim relative min-h-screen"
      style={{ paddingTop: '15vh' }}
    >      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-comfortaa font-normal mb-4 tracking-wider">
            Discover your color type!
          </h2>
          <p className="text-base md:text-3xl opacity-25">
            Just load your image, make sure that all of your face is visible.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start mt-12">
          {/* Left - image + upload button */}
          <div className="w-full md:w-[40%] flex flex-col items-start">
            {!image ? (
              <div 
                className="border border-black rounded-lg w-full max-w-[320px] flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => document.getElementById('file-upload').click()}
                style={{ aspectRatio: '1 / 1' }}
              >
                <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-500 text-lg font-semibold">BROWSE</span>
                <input 
                  id="file-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={handleUpload}
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="border border-black rounded-lg overflow-hidden w-full max-w-[320px]" style={{ aspectRatio: '1 / 1' }}>
                <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
              </div>
            )}

            <button 
              onClick={analyzeImage}
              disabled={!image || loading}
              className={`mt-6 w-full max-w-[320px] py-3 rounded-full font-medium transition ${image ? 'bg-[rgba(221,221,221,0.35)] text-black hover:bg-[rgba(221,221,221,0.35)]' : 'bg-[rgba(221,221,221,0.35)] text-black cursor-not-allowed'}`}
              style={{
                backdropFilter: 'blur(4px)',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)'
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {/* Right - results */}
          <div className="w-full md:w-[60%] flex flex-col items-end space-y-6">
            <div className="w-full max-w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="md:text-2xl">Your color type is</h3>
                <h4 className="text-red-500 text-2xl uppercase font-medium ml-auto" style={{ textAlign: 'right' }}>
                  {colorType?.type || 'UNKNOWN'}
                </h4>
              </div>

              {colorType ? (
                <>
                  {['meaning', 'suitableColors', 'unsuitableColors'].map((section) => {
                    const isExpanded = expandedSection === section;
                    let title = '';
                    let content = null;

                    if (section === 'meaning') {
                      title = 'What does it mean?';
                      content = <div className="p-4 pt-0 text-black">{colorType.meaning}</div>;
                    } else if (section === 'suitableColors') {
                      title = 'What colors suit you?';
                      content = (
                        <div className="p-4 pt-0 text-black">
                          <p className="mb-1 mt-1">{colorType.suitableColors.description}</p>
                          <div className="flex gap-3 mt-3">
                            {colorType.suitableColors.palette.map((color, i) => (
                              <div 
                                key={i} 
                                className="w-8 h-8 rounded border border-gray-200 shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    } else if (section === 'unsuitableColors') {
                      title = "What colors don't suit you?";
                      content = (
                        <div className="p-4 pt-0 text-black">
                          <p className="mb-4 mt-0">{colorType.unsuitableColors.description}</p>
                          <div className="flex gap-3 mt-3">
                            {colorType.unsuitableColors.palette.map((color, i) => (
                              <div 
                                key={i} 
                                className="w-8 h-8 rounded border border-gray-200 shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    }

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
                        <div 
                          className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                          {content}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-gray-400 italic mt-6">
                  {image ? 'Click "Analyze" to see results' : 'Upload and analyze your photo to see results'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
