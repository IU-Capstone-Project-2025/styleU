import React, { useState } from 'react';
import colorTypeImage from '../assets/color-type.png';
import outfitSuggestionImage from '../assets/outfit-suggestion.png';
import bodyShapeImage from '../assets/body-shape.png';
import fittingToolImage from '../assets/fitting-tool.png';

const steps = [
  {
    title: 'Color Type',
    description:
      'We analyze your photo and skin undertone to define your color season. With this, we recommend clothing in hues that naturally enhance your complexion and overall look.',
    button: 'Try it!',
    image: colorTypeImage,
  },
  {
    title: 'Body Shape',
    description:
      'Based on your body measurements and shape, we suggest clothing cuts and silhouettes that flatter your figure best.',
    button: 'Try it!',
    image: bodyShapeImage,
  },
  {
    title: 'Shop',
    description:
      'Based on your preferences and our AI styling system, we suggest outfit combinations personalized to your style.',
    button: 'LOGIN',
    subtext: 'In order to try this feature you have to login.',
    image: outfitSuggestionImage,
  },
  {
    title: '3D - Fitting',
    description:
      'Try on clothes virtually with our 3D fitting tool. Visualize how each look fits your body in motion and get confident about your next purchase.',
    button: 'LOGIN',
    subtext: 'In order to try this feature you have to login.',
    image: fittingToolImage,
  },
];

function About() {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNext = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const goToPrevious = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const { title, description, button, subtext, image } = steps[currentStep];

  return (
    <section
      id="about"
      className="px-4 pb-12 font-anaheim"
      style={{ paddingTop: '25vh', scrollBehavior: 'smooth' }}
    >

      {/* Header & Nav Dots */}
      <div className="flex flex-col items-center justify-center text-center mb-4">
        <h2 className="text-4xl md:text-5xl font-comfortaa font-normal style={{ letterSpacing: '2.0em' }}">
          Perfect wardrobe in just few steps.
        </h2>
        <p className="text-gray-500 font-anaheim text-base md:text-lg mb-8 md:mb-5">
          Try it yourself! It’s easy, and fun!
        </p>

        <div className="flex items-center justify-center space-x-4 mb-6 md:mb-1">
          {/* Left Arrow Button */}
          <button
            onClick={goToPrevious}
            className="w-5 h-5 rounded-full bg-[#d8dbe0] text-black text-sm flex items-center justify-center shadow-sm hover:scale-105 hover:bg-[#cbd0d6] transition-all"
          >
            <span className="inline-block -translate-x-[1px]">←</span>
          </button>

          {/* Dot Indicators */}
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-300 ${
                  index === currentStep
                    ? 'w-6 h-2 rounded-full bg-black'
                    : 'w-2 h-2 rounded-full bg-gray-400'
                }`}
              ></div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={goToNext}
            className="w-5 h-5 rounded-full bg-[#d8dbe0] text-black text-sm flex items-center justify-center shadow-sm hover:scale-105 hover:bg-[#cbd0d6] transition-all"
          >
            <span className="inline-block translate-x-[1px]">→</span>
          </button>
        </div>

      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-10">
        <div className="text-left max-w-lg">
          <h3 className="text-xl font-bold mb-3">{currentStep + 1}. {title}</h3>
          <p className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">{description}</p>
          <button className="bg-[#f4f0eb] text-gray-700 font-anaheim py-2 px-5 rounded-full shadow-md">
            {button}
          </button>
          {subtext && (
            <p className="text-sm text-gray-400 mt-2 italic">{subtext}</p>
          )}
        </div>

        <div className="mt-4 md:mt-8">
          <img
            src={image}
            alt={`Step ${currentStep + 1} Preview`}
            className="w-[300px] md:w-[360px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export default About;
