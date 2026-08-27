import { useEffect, useState } from 'react';
import { heroSlides } from '../data/siteData';

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatically change slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Previous slide
  const previousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  // Next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section className="hero-slideshow">
      {/* =====================================================
          HERO SLIDES
      ====================================================== */}
      <div className="hero-slides">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.image}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
            aria-label={slide.alt}
          />
        ))}
      </div>

      {/* =====================================================
          HERO OVERLAY
      ====================================================== */}
      <div className="hero-overlay"></div>

      {/* =====================================================
          GREEN FALLING CRYSTALS
      ====================================================== */}
      <div className="hero-crystals">
        {Array.from({ length: 25 }).map((_, index) => (
          <span
            key={index}
            className="hero-crystal"
            style={{
              '--x': `${Math.random() * 100}%`,
              '--size': `${8 + Math.random() * 12}px`,
              '--duration': `${7 + Math.random() * 7}s`,
              '--delay': `${Math.random() * -12}s`,
              '--drift': `${-80 + Math.random() * 160}px`,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          FIXED HERO CONTENT
      ====================================================== */}
      <div className="hero-content">
        <div className="hero-content-inner">
          <div className="hero-eyebrow">TRAVEL BEYOND EXPECTATIONS</div>

          <h1>
            Your Journey.
            <span>Our Passion.</span>
          </h1>

          <p>
            Private transfers, tours and unforgettable journeys across Cape Town and South Africa.
          </p>

          <div className="hero-actions">
            <a href="/contact" className="btn btn-primary">
              Book Your Journey
              <span>→</span>
            </a>

            <a href="/services" className="hero-text-link">
              Explore Services
              <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================
          HERO CONTROLS
      ====================================================== */}
      <div className="hero-controls">
        {/* Previous */}
        <button
          type="button"
          className="hero-arrow"
          onClick={previousSlide}
          aria-label="Previous slide"
        >
          ←
        </button>

        {/* Indicators */}
        <div className="hero-indicators">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button type="button" className="hero-arrow" onClick={nextSlide} aria-label="Next slide">
          →
        </button>
      </div>

      {/* =====================================================
          HERO COUNTER
      ====================================================== */}
      <div className="hero-counter">
        <span>{String(currentSlide + 1).padStart(2, '0')}</span>

        <i></i>

        <span>{String(heroSlides.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
