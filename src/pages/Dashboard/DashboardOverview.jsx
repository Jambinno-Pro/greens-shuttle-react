import React, { useEffect, useState } from 'react';

const DashboardOverview = () => {
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [bookingsResponse, contactsResponse, quotesResponse] = await Promise.all([
          fetch('http://localhost:5000/api/bookings'),
          fetch('http://localhost:5000/api/contact'),
          fetch('http://localhost:5000/api/quotes'),
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

  const pendingBookings = bookings.filter((booking) => booking.status === 'pending').length;

  const unreadContacts = contacts.filter((contact) => contact.status === 'unread').length;

  const newQuotes = quotes.filter((quote) => quote.status === 'new').length;

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      {/* ERROR */}
      {error && <div className="dashboard-error">{error}</div>}

      {/* STATS */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-label">TOTAL BOOKINGS</span>

            <span className="dashboard-stat-icon">▣</span>
          </div>

          <strong>{bookings.length}</strong>

          <span className="dashboard-stat-description">All booking requests</span>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-label">PENDING BOOKINGS</span>

            <span className="dashboard-stat-icon">◷</span>
          </div>

          <strong>{pendingBookings}</strong>

          <span className="dashboard-stat-description">Awaiting attention</span>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-label">QUOTE REQUESTS</span>

            <span className="dashboard-stat-icon">▤</span>
          </div>

          <strong>{quotes.length}</strong>

          <span className="dashboard-stat-description">
            {newQuotes} new request{newQuotes === 1 ? '' : 's'}
          </span>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-label">CONTACT ENQUIRIES</span>

            <span className="dashboard-stat-icon">✉</span>
          </div>

          <strong>{contacts.length}</strong>

          <span className="dashboard-stat-description">
            {unreadContacts} unread message
            {unreadContacts === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <span className="dashboard-panel-eyebrow">ACTIVITY</span>

            <h2>Recent Bookings</h2>
          </div>

          <span className="dashboard-panel-count">{bookings.length} Total</span>
        </div>

        {recentBookings.length === 0 ? (
          <div className="dashboard-empty">
            <span>▣</span>
            <h3>No bookings yet</h3>
            <p>Customer booking requests will appear here.</p>
          </div>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
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
                    <td>
                      <strong>{booking.id}</strong>
                    </td>

                    <td>
                      <div className="dashboard-customer">
                        <strong>{booking.name}</strong>
                        <span>{booking.email}</span>
                      </div>
                    </td>

                    <td>
                      <div className="dashboard-journey">
                        <span>{booking.pickup}</span>
                        <small>↓</small>
                        <span>{booking.destination}</span>
                      </div>
                    </td>

                    <td>
                      <div className="dashboard-date">
                        <strong>{formatDate(booking.travelDate)}</strong>

                        <span>{booking.travelTime || '-'}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`dashboard-status-badge ${booking.status}`}>
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
    </div>
  );
};

export default DashboardOverview;
