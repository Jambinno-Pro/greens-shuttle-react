import SectionTitle from '../components/SectionTitle';
import { destinations } from '../data/siteData';
import './Destinations.css';

export default function Destinations() {
  return (
    <main className="destinations-screen">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="destinations-screen-hero">
        <div className="destinations-screen-hero-shade">
          <div className="destinations-screen-hero-inner">
            <div className="destinations-screen-hero-copy">
              <span className="destinations-screen-eyebrow">GREENS SHUTTLE</span>

              <h1>
                Discover
                <span> South Africa</span>
              </h1>

              <p>
                Explore breathtaking destinations, coastal escapes, wine regions and unforgettable
                journeys across South Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DESTINATIONS SECTION
      ===================================================== */}

      <section className="destinations-screen-section">
        <div className="destinations-screen-container">
          <div className="destinations-screen-heading">
            <SectionTitle
              eyebrow="DESTINATIONS"
              title="Where will we take you?"
              text="From Cape Town and the Winelands to spectacular coastlines, forests and wild landscapes."
            />
          </div>

          {/* =================================================
              DESTINATION GRID
          ================================================= */}

          <div className="destinations-screen-grid">
            {destinations.map((destination, index) => (
              <article className="destinations-screen-card" key={destination.title}>
                {/* IMAGE */}

                <div className="destinations-screen-card-media">
                  <img src={destination.image} alt={destination.title} />
                </div>

                {/* DARK OVERLAY */}

                <div className="destinations-screen-card-shade" />

                {/* CARD CONTENT */}

                <div className="destinations-screen-card-content">
                  <span className="destinations-screen-card-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="destinations-screen-card-label">DESTINATION</span>

                  <h2>{destination.title}</h2>

                  {destination.description && <p>{destination.description}</p>}

                  <a href="/book" className="destinations-screen-card-action">
                    Plan this journey
                    <span className="destinations-screen-card-arrow">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
