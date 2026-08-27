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
  Building2,
  Clock3,
  Hotel,
  Utensils,
  Compass,
  TreePine,
  Waves,
  ShieldCheck,
  Sparkles,
  Check,
} from 'lucide-react';

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

export default function ServiceCard({
  icon,
  title,
  description,
  items = [],
  link,
  linkText = 'Book This Service',
  image,
}) {
  return (
    <article className="service-card">
      {/* =====================================================
          IMAGE
      ====================================================== */}

      <div className="service-card-image-wrapper">
        <img src={image} alt={title} className="service-card-image" />

        {/* SERVICE ICON */}
        <div className="service-card-icon">{icon}</div>
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

        {items.length > 0 && (
          <ul className="service-features">
            {items.map((item, index) => {
              const FeatureIcon = featureIcons[item] || Check;

              return (
                <li key={`${item}-${index}`}>
                  <span className="feature-icon">
                    <FeatureIcon size={13} strokeWidth={2.2} />
                  </span>

                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* ===================================================
            BOOK BUTTON
        ==================================================== */}

        {link && (
          <a href={link} className="service-card-button">
            <span>{linkText}</span>

            <span className="service-card-button-arrow">→</span>
          </a>
        )}
      </div>
    </article>
  );
}
