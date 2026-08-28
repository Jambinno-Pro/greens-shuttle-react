import React, { useEffect, useState } from 'react';
import './Contacts.css';

const API_URL = 'http://localhost:5000';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const unreadContacts = contacts.filter((contact) => contact.status === 'unread').length;

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

  const openContact = async (contact) => {
    setSelectedContact(contact);

    // Mark unread message as read locally
    if (contact.status === 'unread') {
      setContacts((currentContacts) =>
        currentContacts.map((item) => (item.id === contact.id ? { ...item, status: 'read' } : item))
      );

      setSelectedContact({
        ...contact,
        status: 'read',
      });

      /*
        We will connect this to the backend later.

        Example:

        await fetch(`${API_URL}/api/contact/${contact.id}/read`, {
          method: 'PATCH',
        });
      */
    }
  };

  const closeContact = () => {
    setSelectedContact(null);
  };

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

            <strong>{loading ? '—' : contacts.length}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">N</div>

          <div>
            <span>Unread</span>

            <strong>{loading ? '—' : unreadContacts}</strong>
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

        {/* LOADING */}

        {loading ? (
          <div className="dashboard-empty">Loading contact enquiries...</div>
        ) : contacts.length === 0 ? (
          <div className="dashboard-empty">
            <div style={{ fontSize: '25px' }}>✉</div>

            <h3>No contact enquiries yet</h3>

            <p>Customer messages submitted through the website contact form will appear here.</p>
          </div>
        ) : (
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
            {/* HEADER */}

            <div className="dashboard-modal-header">
              <div>
                <span className="dashboard-section-label">CUSTOMER ENQUIRY</span>

                <h2>{selectedContact.subject || 'Contact Enquiry'}</h2>
              </div>

              <button type="button" className="dashboard-modal-close" onClick={closeContact}>
                ×
              </button>
            </div>

            {/* CUSTOMER DETAILS */}

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

            {/* MESSAGE */}

            <div className="dashboard-message-body">
              <span className="dashboard-section-label">MESSAGE</span>

              <div className="dashboard-message-text">
                {selectedContact.message || 'No message provided.'}
              </div>
            </div>

            {/* ATTACHMENTS */}

            {selectedContact.attachments && selectedContact.attachments.length > 0 && (
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
            )}

            {/* NO ATTACHMENTS */}

            {(!selectedContact.attachments || selectedContact.attachments.length === 0) && (
              <div className="dashboard-message-attachments">
                <span className="dashboard-section-label">ATTACHMENTS</span>

                <p>No attachments were included with this enquiry.</p>
              </div>
            )}

            {/* ACTIONS */}

            <div className="dashboard-message-actions">
              <a
                href={`mailto:${selectedContact.email}?subject=${encodeURIComponent(
                  `Re: ${selectedContact.subject || 'Your enquiry'}`
                )}`}
                className="dashboard-reply-button"
              >
                Reply to Customer
              </a>

              <button type="button" className="dashboard-secondary-button" onClick={closeContact}>
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
