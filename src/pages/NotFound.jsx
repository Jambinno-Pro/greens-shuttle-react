import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <section className="page section">
      <div className="container narrow">
        <h1>Page not found</h1>
        <Link className="text-link" to="/">
          Return home →
        </Link>
      </div>
    </section>
  );
}
