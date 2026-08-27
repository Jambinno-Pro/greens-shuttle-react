import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';
import { services } from '../data/siteData';
import './Services.css';

export default function Services() {
  return (
    <main className="services-page">
      {/* SERVICES HERO */}
      <section className="services-page-hero">
        <div className="services-page-hero-overlay">
          <div className="container">
            <span className="services-page-eyebrow">GREENS SHUTTLE</span>

            <h1>
              Our <span>Services</span>
            </h1>

            <p>
              Discover Cape Town and beyond with comfortable, reliable and personalised travel
              experiences.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-page-section">
        <div className="container">
          <SectionTitle
            eyebrow="WHAT WE OFFER"
            title="Journeys Designed Around You"
            text="From airport transfers to private tours and unforgettable experiences, we make every journey comfortable and effortless."
          />

          <div className="services-page-grid">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
