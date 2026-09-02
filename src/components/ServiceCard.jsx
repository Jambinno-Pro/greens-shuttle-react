import {
  CalendarDays,
  BriefcaseBusiness,
  Users,
  CalendarCheck,
  Plane,
  Wine,
  Route,
  PawPrint,
  Car,
  MapPin,
  Clock3,
  Hotel,
  Utensils,
  Compass,
  TreePine,
  Sparkles,
  Check,
} from 'lucide-react';

/* =========================================================
   SERVICE ICONS
========================================================= */

const serviceIcons = {
  'Airport Transfers': Plane,
  'Wine Tours': Wine,
  'Garden Route': Route,
  'Game Drives': PawPrint,
  'Chauffeur Services': Car,
  'Events Transfer': CalendarCheck,
};

/* =========================================================
   FEATURE ICONS
========================================================= */

const featureIcons = {
  /* AIRPORT TRANSFERS */
  'Meet & Greet service': Users,
  'Flight monitoring': Plane,
  'Luxury vehicles': Car,
  '24 / 7 availability': Clock3,

  /* WINE TOURS */
  'Stellenbosch & Franschhoek': Wine,
  'Private cellar tours': Wine,
  'Gourmet lunch options': Utensils,
  'Customisable itineraries': Compass,

  /* GARDEN ROUTE */
  'Knysna & Tsitsikamma': TreePine,
  'Scenic coastal routes': Route,
  'Multi-day packages': CalendarDays,
  'Hotel co-ordination': Hotel,

  /* GAME DRIVES */
  'Big Five experiences': PawPrint,
  'Expert ranger guides': Users,
  'Sunrise & sunset drives': Sparkles,
  'Full-day packages': CalendarDays,

  /* CHAUFFEUR SERVICES */
  'Professional chauffeurs': Users,
  'Luxury vehicles': Car,
  'Private door-to-door service': MapPin,
  'Flexible itineraries': Compass,

  /* EVENTS TRANSFER */
  'Wedding transfers': CalendarDays,
  'Corporate events': BriefcaseBusiness,
  'Group transportation': Users,
  'Event coordination': CalendarCheck,
};

/* =========================================================
   SERVICE CARD
========================================================= */

export default function ServiceCard({ service }) {
  if (!service) return null;

  const { title, description, image, features = [] } = service;

  const ServiceIcon = serviceIcons[title] || Car;

  return (
    <article className="service-card">
      {/* =====================================================
          IMAGE
      ====================================================== */}

      <div className="service-card-image-wrapper">
        <img src={image} alt={title} className="service-card-image" />

        {/* IMAGE OVERLAY */}

        <div className="service-card-image-overlay" />

        {/* SERVICE ICON */}

        <div className="service-card-icon">
          <ServiceIcon size={24} strokeWidth={2} />
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="service-card-content">
        <div className="service-card-heading">
          <span className="service-card-number">SERVICE</span>
        </div>

        <h3>{title}</h3>

        {description && <p>{description}</p>}

        {/* ===================================================
            FEATURES
        ==================================================== */}

        {features.length > 0 && (
          <ul className="service-features">
            {features.map((feature, index) => {
              const FeatureIcon = featureIcons[feature] || Check;

              return (
                <li key={`${feature}-${index}`}>
                  <span className="feature-icon">
                    <FeatureIcon size={13} strokeWidth={2.2} />
                  </span>

                  <span>{feature}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* ===================================================
            BOOK THIS SERVICE
        ==================================================== */}

        <a href="/book" className="service-card-button">
          <span>Book This Service</span>

          <span className="service-card-button-arrow">→</span>
        </a>
      </div>
    </article>
  );
}
