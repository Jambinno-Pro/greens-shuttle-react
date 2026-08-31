import React, { useEffect, useState } from 'react';
import './Contacts.css';

const API_URL = 'http://localhost:5000';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [deletingContact, setDeletingContact] = useState(false);

  /* =====================================================
     LOAD CONTACTS
  ====================================================== */

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/contact`);

      if (!response.ok) {
        throw new Error('Unable to load contact enquiries.');
      }

      const data = await response.json();

      setContacts(data.contacts || []);
    } catch (err) {
      console.error('Contacts error:', err);

      setError('Unable to load contact enquiries.');
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     STATISTICS
  ====================================================== */

  const unreadContacts = contacts.filter((contact) => contact.status === 'unread').length;

  /* =====================================================
     DATE FORMATTING
  ====================================================== */

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (date) => {
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
     OPEN CONTACT
  ====================================================== */

  const openContact = async (contact) => {
    setSelectedContact(contact);
    setReplyMessage('');
    setReplyStatus('');

    /*
      If already read, nothing needs to happen.
    */

    if (contact.status !== 'unread') {
      return;
    }

    /*
      Update locally immediately so the dashboard
      responds instantly.
    */

    setContacts((currentContacts) =>
      currentContacts.map((item) =>
        item.id === contact.id
          ? {
              ...item,
              status: 'read',
            }
          : item
      )
    );

    setSelectedContact({
      ...contact,
      status: 'read',
    });

    /*
      Save READ status to backend.
    */

    try {
      const response = await fetch(`${API_URL}/api/contact/${contact.id}/read`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        console.error('Unable to save contact read status.');
      }
    } catch (err) {
      console.error('Mark contact as read error:', err);
    }
  };

  /* =====================================================
     CLOSE CONTACT
  ====================================================== */

  const closeContact = () => {
    if (sendingReply || deletingContact) return;

    setSelectedContact(null);
    setReplyMessage('');
    setReplyStatus('');
  };

  /* =====================================================
     SEND REPLY
     
     USES THE EXISTING EMAIL SYSTEM.
     
     POST /api/emails/send
  ====================================================== */

  const handleReply = async (event) => {
    event.preventDefault();

    if (!selectedContact) {
      return;
    }

    const customerEmail = selectedContact.email?.trim();

    if (!customerEmail) {
      setReplyStatus('This contact does not have a customer email address.');

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

          name: selectedContact.name || '',

          subject: `Re: ${selectedContact.subject || 'Your enquiry'}`,

          message: replyMessage.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send reply.');
      }

      setReplyStatus(data.message || 'Reply sent successfully to the customer.');

      setReplyMessage('');

      console.log('✓ Contact reply sent:', data);
    } catch (err) {
      console.error('Reply error:', err);

      setReplyStatus(err.message || 'Unable to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  /* =====================================================
     DELETE CONTACT
  ====================================================== */

  const handleDeleteContact = async () => {
    if (!selectedContact) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete this contact enquiry from ${
        selectedContact.name || 'this customer'
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingContact(true);
      setError('');

      const response = await fetch(`${API_URL}/api/contact/${selectedContact.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete contact enquiry.');
      }

      /*
        Remove it from the dashboard immediately.
      */

      setContacts((currentContacts) =>
        currentContacts.filter((contact) => contact.id !== selectedContact.id)
      );

      /*
        Close popup.
      */

      setSelectedContact(null);
      setReplyMessage('');
      setReplyStatus('');

      console.log('✓ Contact deleted:', selectedContact.id);
    } catch (err) {
      console.error('Delete contact error:', err);

      setError(err.message || 'Unable to delete contact enquiry.');
    } finally {
      setDeletingContact(false);
    }
  };

  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-empty">Loading contact enquiries...</div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ====================================================== */

  return (
    <div className="dashboard-content">
      {/* =====================================================
          CONTACT STATISTICS
      ====================================================== */}

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">C</div>

          <div>
            <span>Total Enquiries</span>

            <strong>{contacts.length}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">N</div>

          <div>
            <span>Unread</span>

            <strong>{unreadContacts}</strong>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTACTS PANEL
      ====================================================== */}

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <span className="dashboard-section-label">ENQUIRIES</span>

            <h2>Contact Messages</h2>
          </div>

          <button type="button" onClick={loadContacts} className="dashboard-refresh-button">
            Refresh
          </button>
        </div>

        {/* ERROR */}

        {error && <div className="dashboard-error">{error}</div>}

        {/* =====================================================
            NO CONTACTS
        ====================================================== */}

        {contacts.length === 0 ? (
          <div className="dashboard-empty">
            <div style={{ fontSize: '25px' }}>✉</div>

            <h3>No contact enquiries yet</h3>

            <p>Customer messages submitted through the website contact form will appear here.</p>
          </div>
        ) : (
          /* =====================================================
             CONTACT TABLE
          ====================================================== */

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => openContact(contact)}
                    className={`dashboard-clickable-row ${
                      contact.status === 'unread' ? 'unread-row' : ''
                    }`}
                  >
                    <td>
                      <strong>{contact.name || '-'}</strong>
                    </td>

                    <td>{contact.email || '-'}</td>

                    <td>{contact.phone || '-'}</td>

                    <td>{contact.subject || '-'}</td>

                    <td>{formatDate(contact.createdAt)}</td>

                    <td>
                      <span className={`dashboard-status ${contact.status || 'unread'}`}>
                        {contact.status || 'unread'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =====================================================
          CONTACT MESSAGE MODAL
      ====================================================== */}

      {selectedContact && (
        <div className="dashboard-modal-overlay" onClick={closeContact}>
          <div className="dashboard-message-modal" onClick={(event) => event.stopPropagation()}>
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="dashboard-modal-header">
              <div>
                <span className="dashboard-section-label">CUSTOMER ENQUIRY</span>

                <h2>{selectedContact.subject || 'Contact Enquiry'}</h2>
              </div>

              <button
                type="button"
                className="dashboard-modal-close"
                onClick={closeContact}
                disabled={sendingReply || deletingContact}
              >
                ×
              </button>
            </div>

            {/* =================================================
                CUSTOMER DETAILS
            ================================================= */}

            <div className="dashboard-message-details">
              <div>
                <span>CUSTOMER</span>

                <strong>{selectedContact.name || '-'}</strong>
              </div>

              <div>
                <span>EMAIL</span>

                <a href={`mailto:${selectedContact.email}`}>{selectedContact.email || '-'}</a>
              </div>

              <div>
                <span>PHONE</span>

                <strong>{selectedContact.phone || '-'}</strong>
              </div>

              <div>
                <span>RECEIVED</span>

                <strong>{formatDateTime(selectedContact.createdAt)}</strong>
              </div>
            </div>

            {/* =================================================
                MESSAGE
            ================================================= */}

            <div className="dashboard-message-body">
              <span className="dashboard-section-label">MESSAGE</span>

              <div className="dashboard-message-text">
                {selectedContact.message || 'No message provided.'}
              </div>
            </div>

            {/* =================================================
                ATTACHMENTS
            ================================================= */}

            {selectedContact.attachments && selectedContact.attachments.length > 0 ? (
              <div className="dashboard-message-attachments">
                <span className="dashboard-section-label">ATTACHMENTS</span>

                <div className="dashboard-attachments-list">
                  {selectedContact.attachments.map((attachment, index) => (
                    <a
                      key={attachment.id || attachment.path || index}
                      href={`${API_URL}${attachment.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="dashboard-attachment"
                    >
                      <span>📎</span>

                      <span>{attachment.name || 'Attachment'}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="dashboard-message-attachments">
                <span className="dashboard-section-label">ATTACHMENTS</span>

                <p>No attachments were included with this enquiry.</p>
              </div>
            )}

            {/* =================================================
                REPLY
            ================================================= */}

            <div className="dashboard-message-actions">
              <form
                onSubmit={handleReply}
                style={{
                  width: '100%',
                }}
              >
                <textarea
                  className="booking-reply-textarea"
                  placeholder="Write your reply to the customer..."
                  rows="5"
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

                <button type="submit" className="dashboard-reply-button" disabled={sendingReply}>
                  {sendingReply ? 'Sending...' : 'Reply to Customer'}
                </button>
              </form>

              {/* DELETE */}

              <button
                type="button"
                className="dashboard-secondary-button"
                onClick={handleDeleteContact}
                disabled={sendingReply || deletingContact}
              >
                {deletingContact ? 'Deleting...' : 'Delete Contact'}
              </button>

              {/* CLOSE */}

              <button
                type="button"
                className="dashboard-secondary-button"
                onClick={closeContact}
                disabled={sendingReply || deletingContact}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
