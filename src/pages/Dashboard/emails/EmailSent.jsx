import React, { useEffect, useMemo, useState } from 'react';

import './EmailSent.css';

const API_URL = 'http://localhost:5000';

const EmailSent = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  /* =========================================================
     LOAD SENT EMAILS
  ========================================================= */

  const loadSentEmails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/emails/sent`);

      if (!response.ok) {
        throw new Error('Unable to load sent emails.');
      }

      const data = await response.json();

      setEmails(data.emails || []);
    } catch (err) {
      console.error('Sent emails error:', err);

      setError('Unable to load sent emails.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSentEmails();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredEmails = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return emails;
    }

    return emails.filter((email) => {
      return (
        email.name?.toLowerCase().includes(searchText) ||
        email.email?.toLowerCase().includes(searchText) ||
        email.subject?.toLowerCase().includes(searchText) ||
        email.message?.toLowerCase().includes(searchText)
      );
    });
  }, [emails, search]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const attachmentCount = emails.filter(
    (email) => email.attachments && email.attachments.length > 0
  ).length;

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

  /* =========================================================
     OPEN EMAIL
  ========================================================= */

  const openEmail = (email) => {
    setSelectedEmail(email);
  };

  /* =========================================================
     CLOSE EMAIL
  ========================================================= */

  const closeEmail = () => {
    setSelectedEmail(null);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="email-sent-loading">
        <div className="email-sent-spinner"></div>

        <p>Loading sent emails...</p>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="email-sent-page">
      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="email-sent-error">
          <span>!</span>

          <p>{error}</p>
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <section className="email-sent-stats">
        {/* TOTAL */}

        <div className="email-sent-stat-card">
          <div className="email-sent-stat-icon">↗</div>

          <div>
            <span>Total Sent</span>

            <strong>{emails.length}</strong>
          </div>
        </div>

        {/* ATTACHMENTS */}

        <div className="email-sent-stat-card">
          <div className="email-sent-stat-icon">📎</div>

          <div>
            <span>With Attachments</span>

            <strong>{attachmentCount}</strong>
          </div>
        </div>

        {/* RESULTS */}

        <div className="email-sent-stat-card">
          <div className="email-sent-stat-icon">≡</div>

          <div>
            <span>Showing</span>

            <strong>{filteredEmails.length}</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN PANEL
      ====================================================== */}

      <section className="email-sent-panel">
        {/* PANEL HEADER */}

        <div className="email-sent-panel-header">
          <div>
            <span className="email-sent-eyebrow">EMAILS</span>

            <h2>Sent</h2>

            <p>View emails sent from the Greens Shuttle dashboard.</p>
          </div>

          {/* REFRESH */}

          <button type="button" className="email-sent-refresh" onClick={loadSentEmails}>
            ↻ Refresh
          </button>
        </div>

        {/* =================================================
            TOOLBAR
        ================================================== */}

        <div className="email-sent-toolbar">
          <div className="email-sent-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search sent emails..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button type="button" onClick={() => setSearch('')}>
                ×
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {filteredEmails.length === 0 ? (
          <div className="email-sent-empty">
            <div className="email-sent-empty-icon">↗</div>

            <h3>No sent emails found</h3>

            <p>
              {emails.length === 0
                ? 'Emails sent from the dashboard will appear here.'
                : 'Try changing your search.'}
            </p>
          </div>
        ) : (
          /* =================================================
             EMAIL LIST
          ================================================== */

          <div className="email-sent-list">
            {filteredEmails.map((email) => (
              <button
                type="button"
                key={email.id}
                className="email-sent-item"
                onClick={() => openEmail(email)}
              >
                {/* AVATAR */}

                <div className="email-sent-avatar">
                  {(email.name || email.email || 'G').charAt(0).toUpperCase()}
                </div>

                {/* CONTENT */}

                <div className="email-sent-item-content">
                  <div className="email-sent-item-top">
                    <strong>{email.name || email.email || 'Unknown Recipient'}</strong>

                    <span>{formatDate(email.createdAt)}</span>
                  </div>

                  <div className="email-sent-item-subject">{email.subject || 'No subject'}</div>

                  <div className="email-sent-item-preview">
                    {email.message || 'No message preview available.'}
                  </div>

                  <div className="email-sent-item-meta">
                    <span>To: {email.email || '-'}</span>

                    {email.attachments && email.attachments.length > 0 && (
                      <span className="email-sent-attachment-count">
                        📎 {email.attachments.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* ARROW */}

                <div className="email-sent-arrow">›</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* =====================================================
          EMAIL MODAL
      ====================================================== */}

      {selectedEmail && (
        <div className="email-sent-modal-overlay" onClick={closeEmail}>
          <div className="email-sent-modal" onClick={(event) => event.stopPropagation()}>
            {/* MODAL HEADER */}

            <div className="email-sent-modal-header">
              <div>
                <span className="email-sent-eyebrow">SENT EMAIL</span>

                <h2>{selectedEmail.subject || 'No Subject'}</h2>
              </div>

              <button type="button" className="email-sent-close" onClick={closeEmail}>
                ×
              </button>
            </div>

            {/* RECIPIENT */}

            <div className="email-sent-recipient">
              <div className="email-sent-avatar large">
                {(selectedEmail.name || selectedEmail.email || 'G').charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{selectedEmail.name || 'Unknown Recipient'}</strong>

                <a href={`mailto:${selectedEmail.email}`}>{selectedEmail.email || '-'}</a>

                <span>{formatDateTime(selectedEmail.createdAt)}</span>
              </div>
            </div>

            {/* MESSAGE */}

            <div className="email-sent-message">
              <span className="email-sent-eyebrow">MESSAGE</span>

              <div className="email-sent-message-body">
                {selectedEmail.message || 'No message provided.'}
              </div>
            </div>

            {/* ATTACHMENTS */}

            <div className="email-sent-attachments">
              <span className="email-sent-eyebrow">ATTACHMENTS</span>

              {selectedEmail.attachments && selectedEmail.attachments.length > 0 ? (
                <div className="email-sent-attachment-list">
                  {selectedEmail.attachments.map((attachment, index) => (
                    <a
                      key={attachment.id || attachment.path || index}
                      href={`${API_URL}${attachment.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="email-sent-attachment"
                    >
                      <span>📎</span>

                      <span>{attachment.name || 'Attachment'}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="email-sent-no-attachments">No attachments were included.</p>
              )}
            </div>

            {/* ACTIONS */}

            <div className="email-sent-modal-actions">
              <a href={`mailto:${selectedEmail.email}`} className="email-sent-reply">
                Email Customer
              </a>

              <button type="button" className="email-sent-secondary" onClick={closeEmail}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EmailSent;
