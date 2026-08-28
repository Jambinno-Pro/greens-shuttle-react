import React, { useEffect, useMemo, useState } from 'react';
import './EmailInbox.css';

const API_URL = 'http://localhost:5000';

const EmailInbox = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  /* =========================================================
LOAD INBOX
========================================================= */

  const loadInbox = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/emails/inbox`);

      if (!response.ok) {
        throw new Error('Unable to load inbox.');
      }

      const data = await response.json();

      setEmails(data.emails || []);
    } catch (err) {
      console.error('Inbox error:', err);
      setError('Unable to load inbox emails.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  /* =========================================================
FILTER EMAILS
========================================================= */

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        email.name?.toLowerCase().includes(searchText) ||
        email.email?.toLowerCase().includes(searchText) ||
        email.subject?.toLowerCase().includes(searchText) ||
        email.message?.toLowerCase().includes(searchText);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' && email.status === 'unread') ||
        (filter === 'read' && email.status === 'read') ||
        (filter === 'attachments' && email.attachments && email.attachments.length > 0);

      return matchesSearch && matchesFilter;
    });
  }, [emails, search, filter]);

  /* =========================================================
STATISTICS
========================================================= */

  const unreadCount = emails.filter((email) => email.status === 'unread').length;

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

  const openEmail = async (email) => {
    setSelectedEmail(email);

    if (email.status === 'unread') {
      setEmails((currentEmails) =>
        currentEmails.map((item) => (item.id === email.id ? { ...item, status: 'read' } : item))
      );

      setSelectedEmail({
        email,
        status: 'read',
      });

      /*
    Backend connection can be added later:

    await fetch(`${API_URL}/api/emails/${email.id}/read`, {
      method: 'PATCH',
    });
  */
    }
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
      <div className="email-inbox-loading">
        {' '}
        <div className="email-inbox-spinner"></div>
        <p>Loading inbox...</p>
      </div>
    );
  }

  /* =========================================================
PAGE
========================================================= */

  return (
    <main className="email-inbox-page">
      {/* =====================================================
      PAGE HEADER
      ====================================================== */}
      <section className="email-inbox-header">
        <div>
          <span className="email-inbox-eyebrow">EMAILS</span>

          <h1>Inbox</h1>

          <p>Manage customer emails and enquiries received by Greens Shuttle.</p>
        </div>

        <button type="button" className="email-inbox-refresh" onClick={loadInbox}>
          ↻ Refresh
        </button>
      </section>
      {/* =====================================================
      ERROR
      ====================================================== */}
      {error && (
        <div className="email-inbox-error">
          <span>!</span>

          <p>{error}</p>
        </div>
      )}
      {/* =====================================================
      STATISTICS
      ====================================================== */}
      <section className="email-inbox-stats">
        <div className="email-inbox-stat-card">
          <div className="email-inbox-stat-icon">✉</div>

          <div>
            <span>Total Emails</span>
            <strong>{emails.length}</strong>
          </div>
        </div>

        <div className="email-inbox-stat-card">
          <div className="email-inbox-stat-icon">●</div>

          <div>
            <span>Unread</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <div className="email-inbox-stat-card">
          <div className="email-inbox-stat-icon">📎</div>

          <div>
            <span>With Attachments</span>
            <strong>{attachmentCount}</strong>
          </div>
        </div>
      </section>
      {/* =====================================================
      INBOX PANEL
      ====================================================== */}
      <section className="email-inbox-panel">
        {/* PANEL HEADER */}

        <div className="email-inbox-panel-header">
          <div>
            <span className="email-inbox-panel-eyebrow">CUSTOMER MESSAGES</span>

            <h2>Inbox</h2>
          </div>

          <span className="email-inbox-count">
            {filteredEmails.length} email
            {filteredEmails.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* =================================================
        TOOLBAR
        ================================================== */}

        <div className="email-inbox-toolbar">
          <div className="email-inbox-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search emails..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button type="button" onClick={() => setSearch('')}>
                ×
              </button>
            )}
          </div>

          <div className="email-inbox-filters">
            <button
              type="button"
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>

            <button
              type="button"
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>

            <button
              type="button"
              className={filter === 'read' ? 'active' : ''}
              onClick={() => setFilter('read')}
            >
              Read
            </button>

            <button
              type="button"
              className={filter === 'attachments' ? 'active' : ''}
              onClick={() => setFilter('attachments')}
            >
              Attachments
            </button>
          </div>
        </div>

        {/* =================================================
        EMAIL LIST
        ================================================== */}

        {filteredEmails.length === 0 ? (
          <div className="email-inbox-empty">
            <div className="email-inbox-empty-icon">✉</div>

            <h3>No emails found</h3>

            <p>
              {emails.length === 0
                ? 'Customer emails will appear here when they are received.'
                : 'Try changing your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="email-inbox-list">
            {filteredEmails.map((email) => (
              <button
                type="button"
                key={email.id}
                className={`email-inbox-item ${email.status === 'unread' ? 'unread' : ''}`}
                onClick={() => openEmail(email)}
              >
                {/* AVATAR */}

                <div className="email-inbox-avatar">
                  {(email.name || email.email || 'G').charAt(0).toUpperCase()}
                </div>

                {/* MAIN CONTENT */}

                <div className="email-inbox-item-content">
                  <div className="email-inbox-item-top">
                    <strong>{email.name || email.email || 'Unknown Sender'}</strong>

                    <span>{formatDate(email.createdAt)}</span>
                  </div>

                  <div className="email-inbox-item-subject">{email.subject || 'No subject'}</div>

                  <div className="email-inbox-item-preview">
                    {email.message || 'No message preview available.'}
                  </div>

                  <div className="email-inbox-item-meta">
                    <span>{email.email || '-'}</span>

                    {email.attachments && email.attachments.length > 0 && (
                      <span className="email-inbox-attachment-count">
                        📎 {email.attachments.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* STATUS */}

                <div className="email-inbox-item-status">
                  {email.status === 'unread' && <span className="email-inbox-unread-dot"></span>}

                  <span className="email-inbox-arrow">›</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
      {/* =====================================================
      EMAIL MODAL
      ====================================================== */}
      {selectedEmail && (
        <div className="email-inbox-modal-overlay" onClick={closeEmail}>
          <div className="email-inbox-modal" onClick={(event) => event.stopPropagation()}>
            {/* MODAL HEADER */}

            <div className="email-inbox-modal-header">
              <div>
                <span className="email-inbox-panel-eyebrow">CUSTOMER EMAIL</span>

                <h2>{selectedEmail.subject || 'No Subject'}</h2>
              </div>

              <button type="button" className="email-inbox-close" onClick={closeEmail}>
                ×
              </button>
            </div>

            {/* SENDER */}

            <div className="email-inbox-sender">
              <div className="email-inbox-avatar large">
                {(selectedEmail.name || selectedEmail.email || 'G').charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{selectedEmail.name || 'Unknown Sender'}</strong>

                <a href={`mailto:${selectedEmail.email}`}>{selectedEmail.email || '-'}</a>

                <span>{formatDateTime(selectedEmail.createdAt)}</span>
              </div>
            </div>

            {/* MESSAGE */}

            <div className="email-inbox-message">
              <span className="email-inbox-panel-eyebrow">MESSAGE</span>

              <div className="email-inbox-message-body">
                {selectedEmail.message || 'No message provided.'}
              </div>
            </div>

            {/* ATTACHMENTS */}

            <div className="email-inbox-attachments">
              <span className="email-inbox-panel-eyebrow">ATTACHMENTS</span>

              {selectedEmail.attachments && selectedEmail.attachments.length > 0 ? (
                <div className="email-inbox-attachment-list">
                  {selectedEmail.attachments.map((attachment, index) => (
                    <a
                      key={attachment.id || attachment.path || index}
                      href={`${API_URL}${attachment.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="email-inbox-attachment"
                    >
                      <span className="email-inbox-file-icon">📎</span>

                      <span>{attachment.name || 'Attachment'}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="email-inbox-no-attachments">No attachments were included.</p>
              )}
            </div>

            {/* ACTIONS */}

            <div className="email-inbox-modal-actions">
              <a
                href={`mailto:${selectedEmail.email}?subject=${encodeURIComponent(
                  `Re: ${selectedEmail.subject || 'Your email'}`
                )}`}
                className="email-inbox-reply"
              >
                Reply to Customer
              </a>

              <button type="button" className="email-inbox-secondary" onClick={closeEmail}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EmailInbox;
