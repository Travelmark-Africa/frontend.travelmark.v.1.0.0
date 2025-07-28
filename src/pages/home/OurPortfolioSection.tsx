import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ModernCardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = [
    {
      category: 'Event Consulting',
      title: 'Africa Energy Expo – Powering Partnerships for a Sustainable Future',
      image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753729758/energy_awxxim.png',
      textColor: 'text-white',
    },
    {
      category: 'High-Level Convenings',
      title: 'International Health Ministerial Summit Rwanda',
      image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753730919/ihms_pxivnk.png',
      textColor: 'text-white',
    },
    {
      category: 'Agribusiness & Development',
      title: "Agro-Food Rwanda Project – Showcasing Africa's Food Security Innovations",
      image: 'https://res.cloudinary.com/dsubfxzdx/image/upload/v1753731827/images_1_byjdeg.png',
      textColor: 'text-white',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + cards.length) % cards.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className='w-full min-h-screen bg-white flex items-center justify-center pt-16 px-6'>
      <div className='max-w-6xl w-full'>
        {/* Header */}
        <div className='text-center mb-12'>
          <p className='text-base text-primary/70 mb-4'>Our Expertise</p>
          <h2 className='text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug'>
            Unlocking Africa's Potential Through
            <br />
            <span className='text-secondary italic'>Strategic Excellence</span>
          </h2>
          <p className='text-base text-primary/70 max-w-2xl mx-auto leading-relaxed'>
            Discover how our involvement in high-impact events reflects our commitment to smart coordination, African
            innovation, and lasting partnerships.
          </p>
        </div>

        {/* Carousel Container */}
        <div className='relative'>
          <div className='overflow-hidden rounded-2xl shadow-2xl'>
            <div
              className='flex transition-transform duration-700 ease-in-out'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {cards.map((card, index) => (
                <div key={index} className='w-full flex-shrink-0 relative h-[500px] group'>
                  {/* Background Image */}
                  <div
                    className='absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.01]'
                    style={{ backgroundImage: `url(${card.image})` }}
                  />

                  {/* Dark Overlay for better text readability */}
                  <div className='absolute inset-0 bg-black/60' />

                  {/* Content */}
                  <div className='relative h-full flex flex-col justify-between p-8 md:p-12'>
                    <div>
                      <span className='inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-[0.87rem] font-medium text-white border border-white/30'>
                        {card.category}
                      </span>
                    </div>

                    <div className='space-y-6'>
                      <h3 className={`text-2xl md:text-3xl font-bold ${card.textColor} leading-snug max-w-2xl`}>
                        {card.title}
                      </h3>

                      <Link to='portfolio'>
                        <button className='group/btn inline-flex items-center px-6 py-3 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium hover:bg-white/25 transition-all duration-300 text-[0.87rem] cursor-pointer'>
                          Learn More
                          <ChevronRight className='ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform' />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-10'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>

          <button
            onClick={nextSlide}
            className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-10'
          >
            <ChevronRight className='w-5 h-5' />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className='flex justify-center mt-8 space-x-2'>
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary scale-125 w-6' : 'bg-primary/40 hover:bg-primary/60'
              }`}
            />
          ))}
        </div>

        {/* Card Counter */}
        <div className='text-center mt-4'>
          <span className='text-primary/70 text-[0.87rem]'>
            {currentIndex + 1} of {cards.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModernCardCarousel;
