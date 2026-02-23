import React from 'react';
import Presentation from '../components/deck/Presentation';
import CoverSlide from '../components/deck/slides/CoverSlide';
import IntroSlide from '../components/deck/slides/IntroSlide';
import AdvantageSlide from '../components/deck/slides/AdvantageSlide';
import ServicesSlide from '../components/deck/slides/ServicesSlide';
import DeepDiveSlide from '../components/deck/slides/DeepDiveSlide';
import MethodologySlide from '../components/deck/slides/MethodologySlide';
import PrivacySlide from '../components/deck/slides/PrivacySlide';
import QuoteSlide from '../components/deck/slides/QuoteSlide';
import OutroSlide from '../components/deck/slides/OutroSlide';

const slides = [
  CoverSlide,
  IntroSlide,
  AdvantageSlide,
  ServicesSlide,
  DeepDiveSlide,
  MethodologySlide,
  PrivacySlide,
  QuoteSlide,
  OutroSlide
];

const Deck = () => {
  return (
    <div className="w-screen h-screen m-0 p-0 overflow-hidden bg-black fixed inset-0 z-[100]">
      <Presentation slides={slides} />
    </div>
  );
};

export default Deck;
