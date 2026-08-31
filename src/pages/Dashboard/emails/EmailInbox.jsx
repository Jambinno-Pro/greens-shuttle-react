import React, { useEffect, useMemo, useState } from 'react';
import './EmailInbox.css';

const API_URL = 'http://localhost:5000';

const EmailInbox = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyEmail, setReplyEmail] = useState(null);

  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');

    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  /* =========================================================
     NORMALIZE EMAIL
  ========================================================= */

  const normalizeEmail = (email, mailbox) => {
    return {
      ...email,

      // Create a unique frontend ID because both mailboxes
      // can contain the same IMAP UID.
      id: `${mailbox}-${email.id}`,

      originalId: email.id,

      mailbox,

      status: email.status === 'read' || email.status === 'unread' ? email.status : 'unread',

      attachments: Array.isArray(email.attachments) ? email.attachments : [],
    };
  };

  /* =========================================================
     LOAD ONE MAILBOX
  ========================================================= */

  const loadMailbox = async (mailbox) => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      throw new Error('Authentication required. Please sign in again.');
    }

    const response = await fetch(
      `${API_URL}/api/emails/inbox?mailbox=${encodeURIComponent(mailbox)}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');

      window.location.href = '/login';

      throw new Error('Your session has expired. Please sign in again.');
    }

    if (!response.ok) {
      let message = `Unable to load ${mailbox} inbox.`;

      try {
        const data = await response.json();

        if (data?.message) {
          message = data.message;
        }
      } catch {
        // Ignore invalid JSON
      }

      throw new Error(message);
    }

    const data = await response.json();

    if (!Array.isArray(data.emails)) {
      return [];
    }

    return data.emails.map((email) => normalizeEmail(email, mailbox));
  };

  /* =========================================================
     LOAD BOTH INBOXES
  ========================================================= */

  const loadInbox = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const [infoEmails, bookingsEmails] = await Promise.all([
        loadMailbox('info'),
        loadMailbox('bookings'),
      ]);

      const combinedEmails = [...infoEmails, ...bookingsEmails].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setEmails(combinedEmails);
    } catch (err) {
      console.error('Inbox error:', err);

      setError(err?.message || 'Unable to load inbox emails.');
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
    const searchText = search.trim().toLowerCase();

    return emails.filter((email) => {
      const matchesSearch =
        !searchText ||
        email.name?.toLowerCase().includes(searchText) ||
        email.email?.toLowerCase().includes(searchText) ||
        email.subject?.toLowerCase().includes(searchText) ||
        email.message?.toLowerCase().includes(searchText);

      let matchesFilter = true;

      if (filter === 'unread') {
        matchesFilter = email.status === 'unread';
      }

      if (filter === 'read') {
        matchesFilter = email.status === 'read';
      }

      if (filter === 'attachments') {
        matchesFilter = email.attachments.length > 0;
      }

      return matchesSearch && matchesFilter;
    });
  }, [emails, search, filter]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const unreadCount = emails.filter((email) => email.status === 'unread').length;

  const attachmentCount = emails.filter((email) => email.attachments.length > 0).length;

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
     OPEN CUSTOMER EMAIL
  ========================================================= */

  const openEmail = (email) => {
    setError('');
    setSuccess('');

    setSelectedEmail({
      ...email,
      status: 'read',
    });

    if (email.status === 'unread') {
      setEmails((currentEmails) =>
        currentEmails.map((item) =>
          item.id === email.id
            ? {
                ...item,
                status: 'read',
              }
            : item
        )
      );
    }
  };

  /* =========================================================
     CLOSE CUSTOMER EMAIL
  ========================================================= */

  const closeEmail = () => {
    setSelectedEmail(null);
  };

  /* =========================================================
     GET CUSTOMER RECIPIENT
  ========================================================= */

  const getRecipientEmail = (email) => {
    if (!email) return '';

    return String(email.email || email.senderEmail || email.from || email.sender || '').trim();
  };

  /* =========================================================
     OPEN REPLY POPUP
  ========================================================= */

  const openReply = (email) => {
    setError('');
    setSuccess('');

    const recipient = getRecipientEmail(email);

    if (!recipient) {
      setError('This customer email does not contain a valid email address.');

      return;
    }

    /*
     * Keep the complete original email object.
     *
     * This is important because the reply popup needs:
     * - customer email
     * - customer name
     * - subject
     * - mailbox
     * - message
     * - attachments
     */

    setReplyEmail({
      ...email,
      email: recipient,
    });

    setReplyMessage('');
    setSelectedEmail(null);
  };

  /* =========================================================
     CLOSE REPLY POPUP
  ========================================================= */

  const closeReply = () => {
    if (sendingReply) return;

    setReplyEmail(null);
    setReplyMessage('');
  };

  /* =========================================================
     SEND REPLY
  ========================================================= */

  const sendReply = async (event) => {
    event.preventDefault();

    if (!replyEmail) {
      return;
    }

    /*
     * Get the customer's actual email address.
     */

    const recipient = getRecipientEmail(replyEmail);

    if (!recipient) {
      setError('Recipient email is required.');
      return;
    }

    if (!replyMessage.trim()) {
      setError('Please enter a message before sending.');
      return;
    }

    try {
      setSendingReply(true);
      setError('');
      setSuccess('');

      const subject = `Re: ${replyEmail.subject || 'Your email'}`;

      /*
       * IMPORTANT:
       *
       * The backend /api/emails/send route expects:
       *
       *     email
       *
       * NOT:
       *
       *     to
       *
       * We therefore send the customer's address
       * using the "email" property.
       *
       * We also explicitly send the correct mailbox
       * so the SMTP sender remains connected to the
       * correct cPanel mailbox.
       */

      const from =
        replyEmail.mailbox === 'bookings'
          ? 'bookings@greensshuttle.co.za'
          : 'info@greensshuttle.co.za';

      const response = await fetch(`${API_URL}/api/emails/send`, {
        method: 'POST',
        headers: getAuthHeaders(),

        body: JSON.stringify({
          email: recipient,
          subject,
          message: replyMessage.trim(),
          from,
        }),
      });

      /* =====================================================
         AUTHENTICATION ERROR
      ===================================================== */

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');

        window.location.href = '/login';

        return;
      }

      /* =====================================================
         READ RESPONSE
      ===================================================== */

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      /* =====================================================
         BACKEND ERROR
      ===================================================== */

      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Unable to send reply.');
      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      setReplyEmail(null);
      setReplyMessage('');

      setSuccess('Reply sent successfully.');

      setTimeout(() => {
        setSuccess('');
      }, 4000);
    } catch (err) {
      console.error('Reply error:', err);

      setError(err?.message || 'Unable to send reply.');
    } finally {
      setSendingReply(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="email-inbox-loading">
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
          HEADER
      ====================================================== */}

      <section className="email-inbox-header">
        <div className="email-inbox-header-content">
          <span className="email-inbox-eyebrow">EMAILS</span>

          <h1>Inbox</h1>

          <p>Manage customer emails and enquiries received by Greens Shuttle.</p>
        </div>

        <button type="button" className="email-inbox-refresh" onClick={loadInbox}>
          ↻ Refresh
        </button>
      </section>

      {/* =====================================================
          SUCCESS
      ====================================================== */}

      {success && (
        <div className="email-inbox-success">
          <div className="email-inbox-success-icon">✓</div>

          <p>{success}</p>

          <button type="button" onClick={() => setSuccess('')}>
            ×
          </button>
        </div>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="email-inbox-error">
          <div className="email-inbox-error-icon">!</div>

          <p>{error}</p>

          <button type="button" onClick={() => setError('')}>
            ×
          </button>
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <section className="email-inbox-stats">
        <div className="email-inbox-stat-card email-inbox-stat-total">
          <div className="email-inbox-stat-icon">✉</div>

          <div className="email-inbox-stat-content">
            <span>Total Emails</span>
            <strong>{emails.length}</strong>
          </div>
        </div>

        <div className="email-inbox-stat-card email-inbox-stat-unread">
          <div className="email-inbox-stat-icon">●</div>

          <div className="email-inbox-stat-content">
            <span>Unread</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <div className="email-inbox-stat-card email-inbox-stat-attachments">
          <div className="email-inbox-stat-icon">📎</div>

          <div className="email-inbox-stat-content">
            <span>With Attachments</span>
            <strong>{attachmentCount}</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          INBOX PANEL
      ====================================================== */}

      <section className="email-inbox-panel">
        <div className="email-inbox-panel-header">
          <div className="email-inbox-panel-heading">
            <span className="email-inbox-panel-eyebrow">CUSTOMER MESSAGES</span>

            <h2>Inbox</h2>
          </div>

          <span className="email-inbox-count">
            <strong>{filteredEmails.length}</strong>

            <span>
              email
              {filteredEmails.length === 1 ? '' : 's'}
            </span>
          </span>
        </div>

        {/* ===================================================
            TOOLBAR
        ==================================================== */}

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
              <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
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

        {/* ===================================================
            EMAIL LIST
        ==================================================== */}

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
                <div className="email-inbox-avatar">
                  {(email.name || email.email || 'G').charAt(0).toUpperCase()}
                </div>

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

                    {email.attachments.length > 0 && (
                      <span className="email-inbox-attachment-count">
                        📎 {email.attachments.length}
                      </span>
                    )}
                  </div>
                </div>

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
          CUSTOMER EMAIL MODAL
      ====================================================== */}

      {selectedEmail && (
        <div className="email-inbox-modal-overlay" onClick={closeEmail}>
          <div className="email-inbox-modal" onClick={(event) => event.stopPropagation()}>
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

                <a href={`mailto:${selectedEmail.email || ''}`}>{selectedEmail.email || '-'}</a>

                <span>{formatDateTime(selectedEmail.createdAt)}</span>

                <span>
                  To:{' '}
                  {selectedEmail.mailbox === 'bookings'
                    ? 'bookings@greensshuttle.co.za'
                    : 'info@greensshuttle.co.za'}
                </span>
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

              {selectedEmail.attachments.length > 0 ? (
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
              <button
                type="button"
                className="email-inbox-reply"
                onClick={() => openReply(selectedEmail)}
              >
                Reply to Customer
              </button>

              <button type="button" className="email-inbox-secondary" onClick={closeEmail}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          REPLY MODAL
      ====================================================== */}

      {replyEmail && (
        <div className="email-reply-overlay" onClick={closeReply}>
          <div className="email-reply-modal" onClick={(event) => event.stopPropagation()}>
            {/* REPLY HEADER */}

            <div className="email-reply-header">
              <div className="email-reply-heading">
                <span className="email-reply-eyebrow">REPLY</span>

                <h2>Reply to Customer</h2>
              </div>

              <button
                type="button"
                className="email-reply-close"
                onClick={closeReply}
                disabled={sendingReply}
                aria-label="Close reply"
              >
                ×
              </button>
            </div>

            {/* REPLY FORM */}

            <form className="email-reply-form" onSubmit={sendReply}>
              {/* TO */}

              <div className="email-reply-field">
                <label htmlFor="reply-to">To</label>

                <div className="email-reply-input">
                  <input
                    id="reply-to"
                    type="email"
                    value={getRecipientEmail(replyEmail)}
                    readOnly
                  />
                </div>
              </div>

              {/* SUBJECT */}

              <div className="email-reply-field">
                <label htmlFor="reply-subject">Subject</label>

                <div className="email-reply-input">
                  <input
                    id="reply-subject"
                    type="text"
                    value={`Re: ${replyEmail.subject || 'Your email'}`}
                    readOnly
                  />
                </div>
              </div>

              {/* MESSAGE */}

              <div className="email-reply-field">
                <label htmlFor="reply-message">Message</label>

                <textarea
                  id="reply-message"
                  value={replyMessage}
                  onChange={(event) => setReplyMessage(event.target.value)}
                  placeholder="Write your reply to the customer..."
                  rows={8}
                  autoFocus
                  disabled={sendingReply}
                />
              </div>

              {/* ACTIONS */}

              <div className="email-reply-actions">
                <button
                  type="button"
                  className="email-reply-cancel"
                  onClick={closeReply}
                  disabled={sendingReply}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="email-reply-send"
                  disabled={sendingReply || !replyMessage.trim() || !getRecipientEmail(replyEmail)}
                >
                  {sendingReply ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default EmailInbox;
