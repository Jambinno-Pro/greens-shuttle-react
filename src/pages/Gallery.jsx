import SectionTitle from '../components/SectionTitle';
export default function Gallery() {
  return (
    <section className="page section">
      <div className="container">
        <SectionTitle eyebrow="OUR GALLERY" title="Travel in comfort." />
        <div className="gallery-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div className="gallery-placeholder" key={i}>
              Gallery Image {i + 1}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
