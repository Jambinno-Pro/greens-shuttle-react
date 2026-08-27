const destinations = [
  'Cape Town',
  'Stellenbosch',
  'Franschhoek',
  'Paarl',
  'Hermanus',
  'Garden Route',
  'Cape Winelands',
];

export default function DestinationMarquee() {
  return (
    <section className="destination-marquee">
      <div className="marquee-track">
        {/* FIRST SET */}
        <div className="marquee-content">
          {destinations.map((destination, index) => (
            <span className="marquee-item" key={`first-${destination}-${index}`}>
              <span>{destination}</span>

              <span className="marquee-star">★</span>
            </span>
          ))}
        </div>

        {/* SECOND SET
            Duplicated for seamless infinite scrolling
        */}
        <div className="marquee-content">
          {destinations.map((destination, index) => (
            <span className="marquee-item" key={`second-${destination}-${index}`}>
              <span>{destination}</span>

              <span className="marquee-star">★</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
