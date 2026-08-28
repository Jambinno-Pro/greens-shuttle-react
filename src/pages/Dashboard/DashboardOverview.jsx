import React, { useEffect, useState } from 'react';

import './DashboardOverview.css';

const API_URL = 'http://localhost:5000';

const DashboardOverview = () => {
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* =========================================================
     LOAD DASHBOARD DATA
  ========================================================= */

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [bookingsResponse, contactsResponse, quotesResponse] = await Promise.all([
          fetch(`${API_URL}/api/bookings`),
          fetch(`${API_URL}/api/contact`),
          fetch(`${API_URL}/api/quotes`),
        ]);

        if (!bookingsResponse.ok || !contactsResponse.ok || !quotesResponse.ok) {
          throw new Error('Unable to load dashboard data.');
        }

        const bookingsData = await bookingsResponse.json();
        const contactsData = await contactsResponse.json();
        const quotesData = await quotesResponse.json();

        setBookings(bookingsData.bookings || []);
        setContacts(contactsData.contacts || []);
        setQuotes(quotesData.quotes || []);
      } catch (err) {
        console.error('Dashboard error:', err);

        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const pendingBookings = bookings.filter((booking) => booking.status === 'pending').length;

  const unreadContacts = contacts.filter((contact) => contact.status === 'unread').length;

  const newQuotes = quotes.filter((quote) => quote.status === 'new').length;

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  /* =========================================================
     RECENT BOOKINGS
  ========================================================= */

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="overview-loading">
        <div className="overview-loading-spinner"></div>

        <p>Loading dashboard...</p>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="overview-page">
      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="overview-error">
          <span>!</span>

          <p>{error}</p>
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <section className="overview-stats">
        {/* TOTAL BOOKINGS */}

        <div className="overview-stat-card overview-stat-bookings">
          <div className="overview-stat-top">
            <span className="overview-stat-label">TOTAL BOOKINGS</span>

            <div className="overview-stat-icon">▣</div>
          </div>

          <strong className="overview-stat-number">{bookings.length}</strong>

          <span className="overview-stat-description">All booking requests</span>
        </div>

        {/* PENDING BOOKINGS */}

        <div className="overview-stat-card overview-stat-pending">
          <div className="overview-stat-top">
            <span className="overview-stat-label">PENDING BOOKINGS</span>

            <div className="overview-stat-icon">◷</div>
          </div>

          <strong className="overview-stat-number">{pendingBookings}</strong>

          <span className="overview-stat-description">Awaiting attention</span>
        </div>

        {/* QUOTES */}

        <div className="overview-stat-card overview-stat-quotes">
          <div className="overview-stat-top">
            <span className="overview-stat-label">QUOTE REQUESTS</span>

            <div className="overview-stat-icon">▤</div>
          </div>

          <strong className="overview-stat-number">{quotes.length}</strong>

          <span className="overview-stat-description">
            {newQuotes} new request
            {newQuotes === 1 ? '' : 's'}
          </span>
        </div>

        {/* CONTACTS */}

        <div className="overview-stat-card overview-stat-contacts">
          <div className="overview-stat-top">
            <span className="overview-stat-label">CONTACT ENQUIRIES</span>

            <div className="overview-stat-icon">✉</div>
          </div>

          <strong className="overview-stat-number">{contacts.length}</strong>

          <span className="overview-stat-description">
            {unreadContacts} unread message
            {unreadContacts === 1 ? '' : 's'}
          </span>
        </div>
      </section>

      {/* =====================================================
          RECENT BOOKINGS
      ====================================================== */}

      <section className="overview-panel">
        {/* PANEL HEADER */}

        <div className="overview-panel-header">
          <div className="overview-panel-heading">
            <span className="overview-panel-eyebrow">ACTIVITY</span>

            <h2>Recent Bookings</h2>

            <p>The latest customer booking requests.</p>
          </div>

          <div className="overview-panel-count">
            <strong>{bookings.length}</strong>

            <span>Total</span>
          </div>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {recentBookings.length === 0 ? (
          <div className="overview-empty">
            <div className="overview-empty-icon">▣</div>

            <h3>No bookings yet</h3>

            <p>Customer booking requests will appear here.</p>
          </div>
        ) : (
          /* =================================================
             BOOKINGS TABLE
          ================================================= */

          <div className="overview-table-container">
            <table className="overview-table">
              <thead>
                <tr>
                  <th>BOOKING</th>
                  <th>CUSTOMER</th>
                  <th>JOURNEY</th>
                  <th>TRAVEL DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    {/* BOOKING */}

                    <td>
                      <div className="overview-booking-id">
                        <strong>{booking.id}</strong>
                      </div>
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      <div className="overview-customer">
                        <strong>{booking.name || '-'}</strong>

                        <span>{booking.email || '-'}</span>
                      </div>
                    </td>

                    {/* JOURNEY */}

                    <td>
                      <div className="overview-journey">
                        <span>{booking.pickup || '-'}</span>

                        <span className="overview-journey-arrow">↓</span>

                        <span>{booking.destination || '-'}</span>
                      </div>
                    </td>

                    {/* DATE */}

                    <td>
                      <div className="overview-date">
                        <strong>{formatDate(booking.travelDate)}</strong>

                        <span>{booking.travelTime || '-'}</span>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span className={`overview-status ${booking.status || 'pending'}`}>
                        <span className="overview-status-dot"></span>

                        {booking.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default DashboardOverview;
