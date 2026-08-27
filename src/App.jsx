import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// PUBLIC PAGES
import Home from './pages/Home';
import Services from './pages/Services';
import Destinations from './pages/Destinations';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import NotFound from './pages/NotFound';

// DASHBOARD PAGES
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardOverview from './pages/Dashboard/DashboardOverview';
import Bookings from './pages/Dashboard/Bookings';
import Contacts from './pages/Dashboard/Contacts';
import Quotes from './pages/Dashboard/Quotes';

export default function App() {
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      {/* PUBLIC NAVBAR */}
      {!isDashboard && <Navbar />}

      <main>
        <Routes>
          {/* ==============================
              PUBLIC WEBSITE
          ============================== */}

          <Route path="/" element={<Home />} />

          <Route path="/services" element={<Services />} />

          <Route path="/destinations" element={<Destinations />} />

          <Route path="/about" element={<About />} />

          <Route path="/gallery" element={<Gallery />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/booking" element={<Booking />} />

          {/* ==============================
              DASHBOARD
          ============================== */}

          <Route path="/dashboard" element={<Dashboard />}>
            {/* /dashboard */}
            <Route index element={<DashboardOverview />} />

            {/* /dashboard/bookings */}
            <Route path="bookings" element={<Bookings />} />

            {/* /dashboard/contacts */}
            <Route path="contacts" element={<Contacts />} />

            {/* /dashboard/quotes */}
            <Route path="quotes" element={<Quotes />} />
          </Route>

          {/* ==============================
              404
          ============================== */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* PUBLIC FOOTER */}
      {!isDashboard && <Footer />}
    </>
  );
}
