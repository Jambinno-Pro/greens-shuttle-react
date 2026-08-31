import React, { useEffect, useState } from 'react';

import './Dashboard.css';

const API_URL = 'http://localhost:5000';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingBooking, setDeletingBooking] = useState(false);

  /* =====================================================
     LOAD BOOKINGS
  ===================================================== */

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/bookings`);

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

  /* =====================================================
     DATE FORMATTING
  ===================================================== */

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

  /* =====================================================
     OPEN BOOKING
  ===================================================== */

  const openBooking = (booking) => {
    setSelectedBooking(booking);
    setReplyMessage('');
    setReplyStatus('');
  };

  /* =====================================================
     CLOSE BOOKING
  ===================================================== */

  const closeBooking = () => {
    if (sendingReply || updatingStatus || deletingBooking) {
      return;
    }

    setSelectedBooking(null);
    setReplyMessage('');
    setReplyStatus('');
  };

  /* =====================================================
     UPDATE BOOKING STATUS
  ===================================================== */

  const handleStatusChange = async (event) => {
    if (!selectedBooking) return;

    const newStatus = event.target.value;

    try {
      setUpdatingStatus(true);
      setError('');

      const response = await fetch(`${API_URL}/api/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update booking status.');
      }

      /* Update selected booking */

      setSelectedBooking((previous) => ({
        ...previous,
        status: newStatus,
      }));

      /* Update booking in table */

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === selectedBooking.id
            ? {
                ...booking,
                status: newStatus,
              }
            : booking
        )
      );
    } catch (err) {
      console.error('Status update error:', err);

      setError(err.message || 'Unable to update booking status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =====================================================
     DELETE BOOKING
  ===================================================== */

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete booking ${selectedBooking.id}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingBooking(true);
      setError('');

      const response = await fetch(`${API_URL}/api/bookings/${selectedBooking.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete booking.');
      }

      /* Remove booking from table */

      setBookings((previousBookings) =>
        previousBookings.filter((booking) => booking.id !== selectedBooking.id)
      );

      /* Close modal */

      setSelectedBooking(null);
      setReplyMessage('');
      setReplyStatus('');
    } catch (err) {
      console.error('Delete booking error:', err);

      setError(err.message || 'Unable to delete booking.');
    } finally {
      setDeletingBooking(false);
    }
  };

  /* =====================================================
     SEND REPLY TO CUSTOMER
     
     IMPORTANT:
     Uses the EXISTING email system.

     POST /api/emails/send

     Nothing in the existing email system is changed.
  ===================================================== */

  const handleReply = async (event) => {
    event.preventDefault();

    if (!selectedBooking) {
      return;
    }

    const customerEmail = selectedBooking.email?.trim();

    if (!customerEmail) {
      setReplyStatus('This booking does not have a customer email address.');

      return;
    }

    if (!replyMessage.trim()) {
      setReplyStatus('Please enter a message before sending.');

      return;
    }

    try {
      setSendingReply(true);
      setReplyStatus('');

      const response = await fetch(`${API_URL}/api/emails/send`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          from: 'info@greensshuttle.co.za',

          email: customerEmail,

          name: selectedBooking.name || '',

          subject: `Re: Booking ${selectedBooking.id}`,

          message: replyMessage.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send reply.');
      }

      setReplyStatus(data.message || 'Reply sent successfully to the customer.');

      setReplyMessage('');

      console.log('✓ Booking reply sent:', data);
    } catch (err) {
      console.error('Reply error:', err);

      setReplyStatus(err.message || 'Unable to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>

        <p>Loading bookings...</p>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="dashboard-bookings">
      {/* =================================================
          ERROR
      ================================================= */}

      {error && <div className="dashboard-error">{error}</div>}

      {/* =================================================
          BOOKINGS PANEL
      ================================================= */}

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

        {/* =================================================
            NO BOOKINGS
        ================================================= */}

        {bookings.length === 0 ? (
          <div className="dashboard-empty">
            <span>▣</span>

            <h3>No bookings yet</h3>

            <p>Customer booking requests will appear here.</p>
          </div>
        ) : (
          /* =================================================
             BOOKINGS TABLE
          ================================================= */

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>BOOKING</th>
                  <th>CUSTOMER</th>
                  <th>JOURNEY</th>
                  <th>TRAVEL DATE</th>
                  <th>PASSENGERS</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    {/* BOOKING */}

                    <td>
                      <strong>{booking.id}</strong>

                      <small>{formatCreatedDate(booking.createdAt)}</small>
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      <div className="dashboard-customer">
                        <strong>{booking.name || '-'}</strong>

                        <span>{booking.email || '-'}</span>

                        <small>{booking.phone || '-'}</small>
                      </div>
                    </td>

                    {/* JOURNEY */}

                    <td>
                      <div className="dashboard-journey">
                        <span>{booking.pickup || '-'}</span>

                        <small>↓</small>

                        <span>{booking.destination || '-'}</span>
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

                    <td>{booking.passengers || '-'}</td>

                    {/* VIEW */}

                    <td>
                      <button
                        type="button"
                        className="dashboard-view-button"
                        onClick={() => openBooking(booking)}
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

      {/* =====================================================
          BOOKING DETAILS MODAL
      ===================================================== */}

      {selectedBooking && (
        <div className="booking-details-overlay" onClick={closeBooking}>
          <div className="booking-details-modal" onClick={(event) => event.stopPropagation()}>
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="booking-details-header">
              <div>
                <span className="booking-details-eyebrow">BOOKING DETAILS</span>

                <h2>{selectedBooking.id}</h2>

                <p>Submitted {formatCreatedDate(selectedBooking.createdAt)}</p>
              </div>

              <button
                type="button"
                className="booking-details-close"
                onClick={closeBooking}
                disabled={sendingReply || updatingStatus || deletingBooking}
              >
                ×
              </button>
            </div>

            {/* =================================================
                01 CUSTOMER
            ================================================= */}

            <section className="booking-details-section">
              <div className="booking-section-heading">
                <span>01</span>

                <div>
                  <small>CUSTOMER</small>
                  <h3>Customer Details</h3>
                </div>
              </div>

              <div className="booking-info-card">
                <div className="booking-info-item">
                  <span>NAME</span>

                  <strong>{selectedBooking.name || '-'}</strong>
                </div>

                <div className="booking-info-item">
                  <span>EMAIL</span>

                  <a href={`mailto:${selectedBooking.email}`}>{selectedBooking.email || '-'}</a>
                </div>

                <div className="booking-info-item">
                  <span>PHONE</span>

                  <a href={`tel:${selectedBooking.phone}`}>{selectedBooking.phone || '-'}</a>
                </div>
              </div>
            </section>

            {/* =================================================
                02 JOURNEY
            ================================================= */}

            <section className="booking-details-section">
              <div className="booking-section-heading">
                <span>02</span>

                <div>
                  <small>JOURNEY</small>
                  <h3>Journey Details</h3>
                </div>
              </div>

              <div className="booking-journey-card">
                <div className="booking-route">
                  <div className="booking-location">
                    <span>PICK-UP</span>

                    <strong>{selectedBooking.pickup || '-'}</strong>
                  </div>

                  <div className="booking-route-arrow">→</div>

                  <div className="booking-location">
                    <span>DESTINATION</span>

                    <strong>{selectedBooking.destination || '-'}</strong>
                  </div>
                </div>

                <div className="booking-journey-meta">
                  <div>
                    <span>TRAVEL DATE</span>

                    <strong>{formatDate(selectedBooking.travelDate)}</strong>
                  </div>

                  <div>
                    <span>TRAVEL TIME</span>

                    <strong>{selectedBooking.travelTime || '-'}</strong>
                  </div>

                  <div>
                    <span>PASSENGERS</span>

                    <strong>{selectedBooking.passengers || '-'}</strong>
                  </div>

                  <div>
                    <span>SERVICE</span>

                    <strong>{selectedBooking.service || '-'}</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                03 CUSTOMER MESSAGE
            ================================================= */}

            <section className="booking-details-section">
              <div className="booking-section-heading">
                <span>03</span>

                <div>
                  <small>CUSTOMER MESSAGE</small>
                  <h3>Additional Information</h3>
                </div>
              </div>

              <div className="booking-message-card">
                {selectedBooking.message ? (
                  <p>{selectedBooking.message}</p>
                ) : (
                  <p className="booking-no-content">No additional information was provided.</p>
                )}
              </div>
            </section>

            {/* =================================================
                04 DOCUMENTS
            ================================================= */}

            <section className="booking-details-section">
              <div className="booking-section-heading">
                <span>04</span>

                <div>
                  <small>DOCUMENTS</small>
                  <h3>Proof of Payment / Documents</h3>
                </div>
              </div>

              <div className="booking-documents-card">
                {selectedBooking.proof ? (
                  <div className="booking-document">
                    <div className="booking-document-icon">📄</div>

                    <div className="booking-document-info">
                      <strong>
                        {selectedBooking.proof.name ||
                          selectedBooking.proof.originalName ||
                          'Proof of Payment'}
                      </strong>

                      <span>Customer document</span>
                    </div>

                    <a
                      href={`http://localhost:5000${selectedBooking.proof.path || ''}`}
                      target="_blank"
                      rel="noreferrer"
                      className="booking-document-button"
                    >
                      View Document
                    </a>
                  </div>
                ) : selectedBooking.attachments && selectedBooking.attachments.length > 0 ? (
                  selectedBooking.attachments.map((attachment, index) => (
                    <div
                      className="booking-document"
                      key={attachment.id || attachment.path || index}
                    >
                      <div className="booking-document-icon">📄</div>

                      <div className="booking-document-info">
                        <strong>{attachment.name || 'Document'}</strong>

                        <span>Customer attachment</span>
                      </div>

                      <a
                        href={`http://localhost:5000${attachment.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="booking-document-button"
                      >
                        View Document
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="booking-no-document">
                    <div className="booking-document-icon">📄</div>

                    <div>
                      <strong>No document uploaded</strong>

                      <p>No proof or document was uploaded with this booking.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                BOOKING STATUS
            ================================================= */}

            <section className="booking-status-section">
              <div>
                <span>BOOKING STATUS</span>

                <h3>Current Booking Status</h3>
              </div>

              <select
                value={selectedBooking.status || 'pending'}
                onChange={handleStatusChange}
                disabled={updatingStatus}
                className={`booking-large-status ${selectedBooking.status || 'pending'}`}
              >
                <option value="pending">Pending</option>

                <option value="in-progress">In Progress</option>

                <option value="completed">Completed</option>
              </select>
            </section>

            {/* =================================================
                CUSTOMER COMMUNICATION
            ================================================= */}

            <section className="booking-reply-section">
              <div className="booking-section-heading">
                <span>✉</span>

                <div>
                  <small>CUSTOMER COMMUNICATION</small>

                  <h3>Reply to Customer</h3>
                </div>
              </div>

              <div className="booking-reply-card">
                <div className="booking-reply-to">
                  <span>TO</span>

                  <strong>{selectedBooking.email || '-'}</strong>
                </div>

                <form onSubmit={handleReply}>
                  <textarea
                    className="booking-reply-textarea"
                    placeholder="Write your reply to the customer..."
                    rows="6"
                    value={replyMessage}
                    onChange={(event) => setReplyMessage(event.target.value)}
                    disabled={sendingReply}
                  />

                  {replyStatus && (
                    <div
                      className={`booking-reply-status ${
                        replyStatus.toLowerCase().includes('success') ? 'success' : 'error'
                      }`}
                    >
                      {replyStatus}
                    </div>
                  )}

                  <div className="booking-reply-footer">
                    <span>
                      Reply will be sent from <strong>info@greensshuttle.co.za</strong>
                    </span>

                    <button type="submit" className="booking-send-reply" disabled={sendingReply}>
                      {sendingReply ? '⏳ Sending...' : 'Send Reply →'}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* =================================================
                QUICK CONTACT
            ================================================= */}

            <section className="booking-quick-contact">
              <span>QUICK CONTACT</span>

              <div className="booking-quick-buttons">
                <a href={`mailto:${selectedBooking.email}`} className="booking-quick-button">
                  ✉ Email Customer
                </a>

                <a href={`tel:${selectedBooking.phone}`} className="booking-quick-button">
                  ☎ Call Customer
                </a>

                <a
                  href={`https://wa.me/${String(selectedBooking.phone || '').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="booking-quick-button"
                >
                  WhatsApp Customer
                </a>
              </div>
            </section>

            {/* =================================================
                DELETE BOOKING
            ================================================= */}

            <section className="booking-quick-contact">
              <span>BOOKING MANAGEMENT</span>

              <div className="booking-quick-buttons">
                <button
                  type="button"
                  className="booking-quick-button"
                  onClick={handleDeleteBooking}
                  disabled={deletingBooking || sendingReply || updatingStatus}
                >
                  {deletingBooking ? '⏳ Deleting...' : 'Delete Booking'}
                </button>
              </div>
            </section>

            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <div className="booking-details-footer">
              <div>
                <span className={`dashboard-status ${selectedBooking.status || 'pending'}`}>
                  {selectedBooking.status || 'pending'}
                </span>

                <span>Booking received {formatCreatedDate(selectedBooking.createdAt)}</span>
              </div>

              <button
                type="button"
                className="booking-close-button"
                onClick={closeBooking}
                disabled={sendingReply || updatingStatus || deletingBooking}
              >
                Close Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
