import React, { useEffect, useState } from 'react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:5000/api/bookings');

      if (!response.ok) {
        throw new Error('Unable to load bookings.');
      }

      const data = await response.json();

      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Bookings error:', err);
      setError('Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCreatedDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-bookings">
      {/* PAGE HEADER */}
      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">BOOKING MANAGEMENT</span>

          <h1>Bookings</h1>

          <p>View and manage all customer booking requests.</p>
        </div>

        <div className="dashboard-header-status">
          <span className="status-dot"></span>
          {bookings.length} Booking
          {bookings.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* ERROR */}
      {error && <div className="dashboard-error">{error}</div>}

      {/* BOOKINGS PANEL */}
      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <span className="dashboard-section-label">CUSTOMER REQUESTS</span>

            <h2>All Bookings</h2>
          </div>

          <button type="button" className="dashboard-refresh-button" onClick={loadBookings}>
            ↻ Refresh
          </button>
        </div>

        {bookings.length === 0 ? (
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
                  <th>PASSENGERS</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    {/* BOOKING ID */}
                    <td>
                      <strong>{booking.id}</strong>

                      <small>{formatCreatedDate(booking.createdAt)}</small>
                    </td>

                    {/* CUSTOMER */}
                    <td>
                      <div className="dashboard-customer">
                        <strong>{booking.name}</strong>

                        <span>{booking.email}</span>

                        <small>{booking.phone}</small>
                      </div>
                    </td>

                    {/* JOURNEY */}
                    <td>
                      <div className="dashboard-journey">
                        <span>{booking.pickup}</span>

                        <small>↓</small>

                        <span>{booking.destination}</span>
                      </div>
                    </td>

                    {/* DATE */}
                    <td>
                      <div className="dashboard-date">
                        <strong>{formatDate(booking.travelDate)}</strong>

                        <span>{booking.travelTime || '-'}</span>
                      </div>
                    </td>

                    {/* PASSENGERS */}
                    <td>{booking.passengers}</td>

                    {/* STATUS */}
                    <td>
                      <span className={`dashboard-status ${booking.status || 'pending'}`}>
                        {booking.status || 'pending'}
                      </span>
                    </td>

                    {/* VIEW */}
                    <td>
                      <button
                        type="button"
                        className="dashboard-view-button"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div className="dashboard-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="dashboard-modal" onClick={(event) => event.stopPropagation()}>
            <div className="dashboard-modal-header">
              <div>
                <span className="dashboard-section-label">BOOKING DETAILS</span>

                <h2>{selectedBooking.id}</h2>
              </div>

              <button
                type="button"
                className="dashboard-modal-close"
                onClick={() => setSelectedBooking(null)}
              >
                ×
              </button>
            </div>

            {/* CUSTOMER */}
            <div className="dashboard-detail-section">
              <h3>Customer</h3>

              <div className="dashboard-detail-grid">
                <div>
                  <span>Name</span>
                  <strong>{selectedBooking.name}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selectedBooking.email}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{selectedBooking.phone}</strong>
                </div>
              </div>
            </div>

            {/* JOURNEY */}
            <div className="dashboard-detail-section">
              <h3>Journey</h3>

              <div className="dashboard-detail-grid">
                <div>
                  <span>Pick-up</span>
                  <strong>{selectedBooking.pickup}</strong>
                </div>

                <div>
                  <span>Destination</span>
                  <strong>{selectedBooking.destination}</strong>
                </div>

                <div>
                  <span>Travel Date</span>
                  <strong>{formatDate(selectedBooking.travelDate)}</strong>
                </div>

                <div>
                  <span>Travel Time</span>
                  <strong>{selectedBooking.travelTime}</strong>
                </div>

                <div>
                  <span>Passengers</span>
                  <strong>{selectedBooking.passengers}</strong>
                </div>

                <div>
                  <span>Service</span>
                  <strong>{selectedBooking.service}</strong>
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="dashboard-detail-section">
              <h3>Additional Information</h3>

              <p className="dashboard-detail-message">
                {selectedBooking.message || 'No additional information provided.'}
              </p>
            </div>

            {/* STATUS */}
            <div className="dashboard-detail-footer">
              <span className={`dashboard-status ${selectedBooking.status || 'pending'}`}>
                {selectedBooking.status || 'pending'}
              </span>

              <span>Submitted {formatCreatedDate(selectedBooking.createdAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
