import React, { useState } from 'react';
import colorTypeImage from '../assets/color-type.png';
import outfitSuggestionImage from '../assets/outfit-suggestion.png';
import bodyShapeImage from '../assets/body-shape.png';
import fittingToolImage from '../assets/fitting-tool.png';
import arrow from '../assets/arrowBlack.png';

const steps = [
  {
    title: 'Color Type',
    description:
      'We analyze your photo and skin undertone to define your color season. With this, we recommend clothing in hues that naturally enhance your complexion and overall look.',
    button: 'Try it!',
    image: colorTypeImage,
    href: '#color'
  },
  {
    title: 'Body Shape',
    description:
      'Based on your body measurements and shape, we suggest clothing cuts and silhouettes that flatter your figure best.',
    button: 'Try it!',
    image: bodyShapeImage,
    href: '#shape'
  },
  {
    title: 'Shop',
    description:
      'Based on your preferences and our AI styling system, we suggest outfit combinations personalized to your style.',
    button: 'LOGIN',
    subtext: 'In order to try this feature you have to login.',
    image: outfitSuggestionImage
  },
  {
    title: '3D - Fitting',
    description:
      'Try on clothes virtually with our 3D fitting tool. Visualize how each look fits your body in motion and get confident about your next purchase.',
    button: 'LOGIN',
    subtext: 'In order to try this feature you have to login.',
    image: fittingToolImage
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

  const scrollToSection = (idOrHref) => {
    const element =
      idOrHref.startsWith('#')
        ? document.querySelector(idOrHref)
        : document.getElementById(idOrHref);
    if (element) {
      const offset = 10;
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const { title, description, button, subtext, image, href } = steps[currentStep];

  return (
    <section
      id="about"
      className="px-4 pb-12 font-anaheim"
      style={{ paddingTop: '12vh', scrollBehavior: 'smooth' }}
    >
      {/* Header & Nav Dots */}
      <div className="flex flex-col items-center justify-center text-center mb-4">
        <h2 className="text-3xl md:text-5xl font-comfortaa font-normal mb-4 tracking-wider">
          Perfect wardrobe in just few steps.
        </h2>
        <p className="text-base md:text-2xl opacity-25 mb-4">
          Try it yourself! It’s easy, and fun!
        </p>

        <div className="flex items-center justify-center space-x-4 mb-6 md:mb-1">
          {/* Left Arrow Button */}
          <button
            onClick={goToPrevious}
            className="w-5 h-5 rounded-full bg-[#d8dbe0] flex items-center justify-center shadow-sm hover:scale-105 hover:bg-[#cbd0d6] transition-all"
          >
            <img src={arrow} alt="Left arrow" className="w-3 h-3" />
          </button>

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
            className="w-5 h-5 rounded-full bg-[#d8dbe0] flex items-center justify-center shadow-sm hover:scale-105 hover:bg-[#cbd0d6] transition-all"
          >
            <img src={arrow} alt="Right arrow" className="w-3 h-3 transform -rotate-180" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-10">
        <div className="text-left max-w-lg">
          <h3 className="text-xl font-bold mb-3">{currentStep + 1}. {title}</h3>
          <p className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">{description}</p>
          
          <button
            onClick={() => scrollToSection(href || 'login')}
            className="bg-[rgba(221,221,221,0.35)] text-gray-700 font-anaheim py-2 px-5 rounded-full shadow-md"
          >
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
