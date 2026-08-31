import React, { useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { reviews } from '../data/reviews';
import './GoogleReviews.css';

export default function GoogleReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  /* =========================================================
     NEXT REVIEW
  ========================================================= */

  const nextReview = () => {
    setCurrentIndex((current) => (current + 1) % reviews.length);
  };

  /* =========================================================
     PREVIOUS REVIEW
  ========================================================= */

  const previousReview = () => {
    setCurrentIndex((current) => (current === 0 ? reviews.length - 1 : current - 1));
  };

  /* =========================================================
     AUTOMATIC SLIDE
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     VISIBLE REVIEWS
  ========================================================= */

  const getVisibleReviews = () => {
    if (reviews.length <= 3) {
      return reviews;
    }

    return [
      reviews[currentIndex],
      reviews[(currentIndex + 1) % reviews.length],
      reviews[(currentIndex + 2) % reviews.length],
    ];
  };

  return (
    <section className="google-reviews">
      <div className="container">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="google-reviews-header">
          <span className="section-eyebrow">CUSTOMER REVIEWS</span>

          <h2>What Our Customers Say</h2>

          <p>
            We're proud to provide comfortable, reliable and professional transportation for every
            journey.
          </p>

          {/* GOOGLE RATING */}

          <div className="google-rating">
            <strong>5.0</strong>

            <div className="google-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} fill="currentColor" />
              ))}
            </div>

            <span>Google Reviews</span>
          </div>
        </div>

        {/* =====================================================
            REVIEW CAROUSEL
        ====================================================== */}

        <div className="google-reviews-carousel">
          {/* PREVIOUS */}

          <button
            type="button"
            className="google-review-arrow"
            onClick={previousReview}
            aria-label="Previous review"
          >
            <ChevronLeft size={22} />
          </button>

          {/* REVIEWS */}

          <div className="google-reviews-track">
            {getVisibleReviews().map((review, index) => (
              <article
                className={`google-review-card ${index === 1 ? 'featured' : ''}`}
                key={`${review.id}-${index}`}
              >
                {/* QUOTE ICON */}

                <div className="google-review-card-header">
                  <div className="google-review-quote-wrapper">
                    <Quote size={22} />
                  </div>

                  <Quote className="google-review-quote-large" size={42} />
                </div>

                {/* REVIEWER */}

                <div className="google-review-author">
                  {/* AVATAR */}

                  <div className="google-review-avatar">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.name} />
                    ) : (
                      <span>{review.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="google-review-author-info">
                    <h3>{review.name}</h3>

                    <span className="google-review-verified">Google Reviewer</span>
                  </div>
                </div>

                {/* STARS */}

                <div className="google-review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>

                {/* REVIEW TEXT */}

                <p>{review.text}</p>

                {/* GOOGLE SOURCE */}

                <div className="google-review-source">
                  <span className="google-g">G</span>
                  <span>Google Review</span>
                </div>
              </article>
            ))}
          </div>

          {/* NEXT */}

          <button
            type="button"
            className="google-review-arrow"
            onClick={nextReview}
            aria-label="Next review"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* =====================================================
            DOTS
        ====================================================== */}

        <div className="google-review-dots">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              className={index === currentIndex ? 'active' : ''}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
