export default function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-title">
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}

      {title && <h2>{title}</h2>}

      {text && <p>{text}</p>}
    </div>
  );
}
