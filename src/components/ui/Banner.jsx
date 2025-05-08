import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Button from './Button';
import { FiArrowRight } from 'react-icons/fi';

/**
 * Modern, professional Banner component for homepage
 */
const Banner = ({
  slides = [
    {
      title: 'Streamline Your <span class="text-primary-500">Asset Management</span>',
      description: 'Empower your team with our intuitive platform designed for modern workplaces.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
      primaryButton: {
        text: 'Get Started',
        link: '/auth',
      },
      secondaryButton: {
        text: 'Learn More',
        link: '#features',
      },
      overlayColor: 'from-primary-900/70',
      accentColor: 'primary',
    },
  ],
  autoplay = true,
  interval = 6000,
  showArrows = true,
  showDots = true,
  height = 'h-[80vh]',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle autoplay
  useEffect(() => {
    if (!autoplay) return;

    const timer = setInterval(() => {
      if (!isAnimating) {
        goToNextSlide();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentSlide, isAnimating, autoplay, interval]);

  // Go to next slide
  const goToNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Go to previous slide
  const goToPrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Go to specific slide
  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Get current slide
  const slide = slides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slide */}
      <div className={`relative w-full ${height}`}>
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent z-10"></div>
        <img
          src={slide.image}
          alt={`Slide ${currentSlide + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-500`}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <h1 
                className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
                dangerouslySetInnerHTML={{ __html: slide.title }}
              />
              <p className="text-gray-200 text-lg md:text-xl mb-8">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {slide.primaryButton && (
                  <Link to={slide.primaryButton.link}>
                    <Button 
                      variant={slide.accentColor || 'primary'} 
                      size="lg"
                      icon={<FiArrowRight />}
                    >
                      {slide.primaryButton.text}
                    </Button>
                  </Link>
                )}
                {slide.secondaryButton && (
                  <a href={slide.secondaryButton.link}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="bg-white/90 hover:bg-white border-white text-gray-800"
                    >
                      {slide.secondaryButton.text}
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Dots navigation */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Banner.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      primaryButton: PropTypes.shape({
        text: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
      }),
      secondaryButton: PropTypes.shape({
        text: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
      }),
      overlayColor: PropTypes.string,
      accentColor: PropTypes.string,
    })
  ),
  autoplay: PropTypes.bool,
  interval: PropTypes.number,
  showArrows: PropTypes.bool,
  showDots: PropTypes.bool,
  height: PropTypes.string,
};

export default Banner;
