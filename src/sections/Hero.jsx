import { Link } from 'react-router-dom';
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <p className="eyebrow">WESTERN CAPE TRANSPORT</p>
        <h1>
          Travel comfortably.
          <br />
          <em>Arrive safely.</em>
        </h1>
        <p className="hero-text">
          Reliable shuttle, transfer and private transport services for airport trips, wine tours,
          events, weddings and more.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/book">
            Book Your Transfer
          </Link>
          <Link className="btn btn-outline" to="/services">
            Explore Services
          </Link>
        </div>
      </div>
    </section>
  );
}
