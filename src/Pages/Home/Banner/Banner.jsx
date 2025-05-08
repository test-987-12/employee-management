import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import img1 from "../../../assets/pexels-divinetechygirl-1181304.jpg";
import img2 from "../../../assets/pexels-august-de-richelieu-4427430.jpg";
import img3 from "../../../assets/pexels-fauxels-3184360.jpg";
import Button from '../../../components/ui/Button';

/**
 * Modern, professional Banner component for homepage
 */
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Slides configuration
  const slides = [
    {
      title: 'Streamline Your <span class="text-primary-500">Asset Management</span>',
      description: 'Empower your team with our intuitive platform designed for modern workplaces.',
      image: img1,
      primaryButton: {
        text: 'Join as Employee',
        link: '/auth',
      },
      secondaryButton: {
        text: 'Learn More',
        link: '#features',
      },
      overlayColor: 'from-primary-900/70',
      accentColor: 'primary',
    },
    {
      title: 'Manage Resources <span class="text-secondary-500">Efficiently</span>',
      description: 'Take control of your organization\'s assets with powerful management tools.',
      image: img2,
      primaryButton: {
        text: 'Join as HR Manager',
        link: '/auth',
      },
      secondaryButton: {
        text: 'View Pricing',
        link: '#pricing',
      },
      overlayColor: 'from-secondary-900/70',
      accentColor: 'secondary',
    },
    {
      title: 'Enhance Team <span class="text-purple-500">Collaboration</span>',
      description: 'Connect your workforce with seamless request and approval workflows.',
      image: img3,
      primaryButton: {
        text: 'Get Started',
        link: '/auth',
      },
      secondaryButton: {
        text: 'About Us',
        link: '#about',
      },
      overlayColor: 'from-purple-900/70',
      accentColor: 'primary',
    },
  ];

  // Autoplay configuration
  const autoplay = true;
  const interval = 6000;

  // Handle autoplay
  useEffect(() => {
    if (!autoplay) return;

    const timer = setInterval(() => {
      if (!isAnimating) {
        goToNextSlide();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentSlide, isAnimating]);

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
    <div className="relative w-full overflow-hidden shadow-2xl">
      {/* Slide */}
      <div className="relative w-full h-[80vh]">
        {/* Background image with overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayColor || 'from-gray-900/70'} to-transparent z-10`}></div>
        <img
          src={slide.image}
          alt={`Slide ${currentSlide + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
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

      {/* Dots navigation */}
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
    </div>
  );
};

export default Banner;
