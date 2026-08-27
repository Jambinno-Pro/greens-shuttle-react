export default function DestinationCard({ title, description, image }) {
  return (
    <article className="destination-card">
      {/* =====================================================
          IMAGE
      ====================================================== */}

      <div className="destination-card-image">
        <img src={image} alt={title} loading="lazy" />
      </div>

      {/* =====================================================
          OVERLAY
      ====================================================== */}

      <div className="destination-card-overlay"></div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="destination-card-content">
        <span className="destination-card-label">DESTINATION</span>

        <h3>{title}</h3>

        <p>{description}</p>

        <a href="/contact" className="destination-card-link">
          <span>Explore Destination</span>

          <span className="destination-card-arrow">→</span>
        </a>
      </div>
    </article>
  );
}
