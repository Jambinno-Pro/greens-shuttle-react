import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from './pages/Home';
import Services from './pages/Services';
import Destinations from './pages/Destinations';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import NotFound from './pages/NotFound';

// =====================================================
// DASHBOARD
// =====================================================

import Dashboard from './pages/Dashboard/Dashboard';
import DashboardOverview from './pages/Dashboard/DashboardOverview';
import Bookings from './pages/Dashboard/Bookings';
import Contacts from './pages/Dashboard/Contacts';
import Quotes from './pages/Dashboard/Quotes';
import Documents from './pages/Dashboard/Documents';

// =====================================================
// DASHBOARD — EMAILS
// =====================================================

import EmailInbox from './pages/Dashboard/emails/EmailInbox';
import EmailSent from './pages/Dashboard/emails/EmailSent';

// =====================================================
// APP
// =====================================================

export default function App() {
  const location = useLocation();

  // =====================================================
  // HIDE PUBLIC NAVBAR + FOOTER ON DASHBOARD
  // =====================================================

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      {/* =====================================================
          PUBLIC NAVBAR
      ===================================================== */}

      {!isDashboard && <Navbar />}

      {/* =====================================================
          ROUTES
      ===================================================== */}

      <main>
        <Routes>
          {/* =================================================
              PUBLIC WEBSITE
          ================================================= */}

          <Route path="/" element={<Home />} />

          <Route path="/services" element={<Services />} />

          <Route path="/destinations" element={<Destinations />} />

          <Route path="/about" element={<About />} />

          <Route path="/gallery" element={<Gallery />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/booking" element={<Booking />} />

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route path="/dashboard" element={<Dashboard />}>
            {/* -----------------------------------------------
                OVERVIEW
                /dashboard
            ------------------------------------------------ */}

            <Route index element={<DashboardOverview />} />

            {/* -----------------------------------------------
                BOOKINGS
                /dashboard/bookings
            ------------------------------------------------ */}

            <Route path="bookings" element={<Bookings />} />

            {/* -----------------------------------------------
                CONTACTS
                /dashboard/contacts
            ------------------------------------------------ */}

            <Route path="contacts" element={<Contacts />} />

            {/* -----------------------------------------------
                QUOTES
                /dashboard/quotes
            ------------------------------------------------ */}

            <Route path="quotes" element={<Quotes />} />

            {/* -----------------------------------------------
                DOCUMENTS
                /dashboard/documents
            ------------------------------------------------ */}

            <Route path="documents" element={<Documents />} />

            {/* =================================================
                EMAILS
            ================================================== */}

            {/* -----------------------------------------------
                EMAILS → REDIRECT TO INBOX

                /dashboard/emails
                    ↓
                /dashboard/emails/inbox
            ------------------------------------------------ */}

            <Route path="emails" element={<Navigate to="/dashboard/emails/inbox" replace />} />

            {/* -----------------------------------------------
                EMAIL INBOX
                /dashboard/emails/inbox
            ------------------------------------------------ */}

            <Route path="emails/inbox" element={<EmailInbox />} />

            {/* -----------------------------------------------
                SENT EMAILS
                /dashboard/emails/sent
            ------------------------------------------------ */}

            <Route path="emails/sent" element={<EmailSent />} />

            {/* -----------------------------------------------
                EMAIL ATTACHMENTS

                Add EmailAttachments later when the component
                has been created.
            ------------------------------------------------ */}

            {/* 
            <Route
              path="emails/attachments"
              element={<EmailAttachments />}
            />
            */}

            {/* -----------------------------------------------
                COMPOSE EMAIL

                Add EmailCompose later when the component
                has been created.
            ------------------------------------------------ */}

            {/* 
            <Route
              path="emails/compose"
              element={<EmailCompose />}
            />
            */}
          </Route>

          {/* =================================================
              404 — PAGE NOT FOUND
          ================================================== */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* =====================================================
          PUBLIC FOOTER
      ===================================================== */}

      {!isDashboard && <Footer />}
    </>
  );
}
