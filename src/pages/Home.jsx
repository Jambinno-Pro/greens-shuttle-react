import HeroSlideshow from '../components/HeroSlideShow';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';
import DestinationCard from '../components/DestinationCard';
import BookingForm from '../components/BookingForm';
import DestinationMarquee from '../components/DestinationMarquee';
import GoogleReviews from '../components/GoogleReviews';

import { services, destinations } from '../data/siteData';

import { Plane, Wine, Route, PawPrint, Car, CalendarDays } from 'lucide-react';

/* =========================================================
   HOME
   ========================================================= */

export default function Home() {
  return (
    <main>
      {/* =====================================================
          HERO
      ====================================================== */}

      <HeroSlideshow />

      {/* =====================================================
          BOOKING
      ====================================================== */}

      <BookingForm />

      {/* =====================================================
          DESTINATION MARQUEE
      ====================================================== */}

      <DestinationMarquee />

      {/* =====================================================
          SERVICES
      ====================================================== */}

      {/* =====================================================
    SERVICES
====================================================== */}

      <section className="home-services section">
        <div className="container">
          <SectionTitle
            eyebrow="WHAT WE DO"
            title="Journeys Designed Around You"
            text="From seamless airport transfers to unforgettable experiences, Greens Transport and Shuttle Services makes every journey comfortable and effortless."
          />

          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT / EXPERIENCE
      ====================================================== */}

      <section className="experience-section">
        <div className="experience-image">
          <img src="/images/about/greens-experience.jpg" alt="Greens Shuttle travel experience" />
        </div>

        <div className="experience-content">
          <span className="section-eyebrow">ABOUT GREENS SHUTTLE</span>

          <h2>
            Travel comfortably.
            <br />
            Experience more.
          </h2>

          <p>
            Greens Transport and Shuttle Services provides reliable private transportation and
            carefully curated travel experiences across Cape Town and South Africa.
          </p>

          <p>
            Whether you're arriving at Cape Town International, exploring the Winelands or planning
            a longer adventure, we're here to make your journey memorable.
          </p>

          <a href="/about" className="text-link">
            Discover Greens Shuttle →
          </a>

          {/* EXPERIENCE STATS */}

          <div className="experience-stats">
            <div>
              <strong>24/7</strong>
              <span>Availability</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Personal Service</span>
            </div>

            <div>
              <strong>CAPE</strong>
              <span>&amp; Beyond</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DESTINATIONS
      ====================================================== */}

      <section className="destinations-section section">
        <div className="container">
          <SectionTitle
            eyebrow="DESTINATIONS"
            title="Discover South Africa"
            text="From the vibrant streets of Cape Town to the scenic Winelands, breathtaking coastlines and unforgettable Garden Route, discover South Africa in comfort and style. Let Greens Transport and Shuttle take you there with reliable private transportation and journeys designed around you."
          />

          <div className="destinations-grid">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.title}
                title={destination.title}
                description={destination.description}
                image={destination.image}
              />
            ))}
          </div>
        </div>
      </section>

      <GoogleReviews />
    </main>
  );
}
