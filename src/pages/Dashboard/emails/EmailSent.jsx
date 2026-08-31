import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './EmailSent.css';

const API_URL = 'http://localhost:5000';

const EmailSent = () => {
  const navigate = useNavigate();

  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');

  /* =========================================================
     REPLY STATE
  ========================================================= */

  const [replyMode, setReplyMode] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replySuccess, setReplySuccess] = useState('');

  /* =========================================================
     HANDLE AUTH FAILURE
  ========================================================= */

  const handleUnauthorized = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');

    navigate('/login', {
      state: {
        from: '/dashboard/emails/sent',
      },
      replace: true,
    });
  };

  /* =========================================================
     LOAD SENT EMAILS
  ========================================================= */

  const loadSentEmails = async () => {
    try {
      setLoading(true);
      setError('');

      /* =====================================================
         GET JWT TOKEN
      ===================================================== */

      const token = localStorage.getItem('adminToken');

      if (!token) {
        handleUnauthorized();
        return;
      }

      /* =====================================================
         GET SENT EMAILS
      ===================================================== */

      const response = await fetch(`${API_URL}/api/emails/sent`, {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      /* =====================================================
         TOKEN EXPIRED / INVALID
      ===================================================== */

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      /* =====================================================
         OTHER BACKEND ERRORS
      ===================================================== */

      if (!response.ok) {
        let message = 'Unable to load sent emails.';

        try {
          const data = await response.json();

          if (data?.message) {
            message = data.message;
          }
        } catch {
          // Ignore invalid JSON response
        }

        throw new Error(message);
      }

      /* =====================================================
         READ RESPONSE
      ===================================================== */

      const data = await response.json();

      setEmails(Array.isArray(data.emails) ? data.emails : []);
    } catch (err) {
      console.error('Sent emails error:', err);

      setError(err?.message || 'Unable to load sent emails.');
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

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
    (email) => Array.isArray(email.attachments) && email.attachments.length > 0
  ).length;

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return '-';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }

    return parsedDate.toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    if (!date) return '-';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }

    return parsedDate.toLocaleString('en-ZA', {
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

    setReplyMode(false);
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');
  };

  /* =========================================================
     CLOSE EMAIL
  ========================================================= */

  const closeEmail = () => {
    if (replySending) {
      return;
    }

    setSelectedEmail(null);

    setReplyMode(false);
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');
  };

  /* =========================================================
     START REPLY
  ========================================================= */

  const startReply = () => {
    if (!selectedEmail) {
      return;
    }

    setReplyMode(true);
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');
  };

  /* =========================================================
     CANCEL REPLY
  ========================================================= */

  const cancelReply = () => {
    if (replySending) {
      return;
    }

    setReplyMode(false);
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');
  };

  /* =========================================================
     SEND REPLY
  ========================================================= */

  const sendReply = async (event) => {
    event.preventDefault();

    if (!selectedEmail) {
      return;
    }

    /* =======================================================
       VALIDATE RECIPIENT
    ======================================================= */

    if (!selectedEmail.email) {
      setReplyError('This email does not have a valid recipient address.');
      return;
    }

    /* =======================================================
       VALIDATE MESSAGE
    ======================================================= */

    if (!replyMessage.trim()) {
      setReplyError('Please enter a reply message.');
      return;
    }

    /* =======================================================
       AUTH TOKEN
    ======================================================= */

    const token = localStorage.getItem('adminToken');

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setReplySending(true);
      setReplyError('');
      setReplySuccess('');

      /* =====================================================
         REPLY SUBJECT
      ===================================================== */

      const originalSubject = selectedEmail.subject || 'Your Greens Shuttle enquiry';

      const replySubject = originalSubject.toLowerCase().startsWith('re:')
        ? originalSubject
        : `Re: ${originalSubject}`;

      /* =====================================================
         FORM DATA

         IMPORTANT:
         We use FormData because the send endpoint can
         also accept attachments.

         DO NOT set Content-Type manually.
         The browser sets multipart/form-data automatically.
      ===================================================== */

      const formData = new FormData();

      formData.append('email', selectedEmail.email);
      formData.append('name', selectedEmail.name || '');
      formData.append('subject', replySubject);
      formData.append('message', replyMessage.trim());

      /* =====================================================
         SELECT SENDER MAILBOX
      ===================================================== */

      const sender =
        selectedEmail.from ||
        (selectedEmail.mailbox === 'bookings'
          ? 'bookings@greensshuttle.co.za'
          : 'info@greensshuttle.co.za');

      formData.append('from', sender);

      /* =====================================================
         SEND REPLY
      ===================================================== */

      const response = await fetch(`${API_URL}/api/emails/send`, {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      /* =====================================================
         TOKEN EXPIRED / INVALID
      ===================================================== */

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      /* =====================================================
         READ BACKEND RESPONSE
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

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Unable to send reply.');
      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      setReplySuccess(data.message || 'Reply sent successfully.');

      setReplyMessage('');
      setReplyMode(false);

      /* =====================================================
         REFRESH SENT EMAILS
      ===================================================== */

      await loadSentEmails();

      /* =====================================================
         KEEP MODAL OPEN
      ===================================================== */

      if (data.email) {
        setSelectedEmail(data.email);
      }
    } catch (err) {
      console.error('Reply error:', err);

      setReplyError(err?.message || 'Unable to send reply.');
    } finally {
      setReplySending(false);
    }
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
        <div className="email-sent-stat-card">
          <div className="email-sent-stat-icon">↗</div>

          <div>
            <span>Total Sent</span>

            <strong>{emails.length}</strong>
          </div>
        </div>

        <div className="email-sent-stat-card">
          <div className="email-sent-stat-icon">📎</div>

          <div>
            <span>With Attachments</span>

            <strong>{attachmentCount}</strong>
          </div>
        </div>

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

          <button type="button" className="email-sent-refresh" onClick={loadSentEmails}>
            ↻ Refresh
          </button>
        </div>

        {/* =================================================
            SEARCH
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

                    {Array.isArray(email.attachments) && email.attachments.length > 0 && (
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
            {/* =================================================
                HEADER
            ================================================== */}

            <div className="email-sent-modal-header">
              <div>
                <span className="email-sent-eyebrow">SENT EMAIL</span>

                <h2>{selectedEmail.subject || 'No Subject'}</h2>
              </div>

              <button
                type="button"
                className="email-sent-close"
                onClick={closeEmail}
                disabled={replySending}
              >
                ×
              </button>
            </div>

            {/* =================================================
                RECIPIENT
            ================================================== */}

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

            {/* =================================================
                SUCCESS
            ================================================== */}

            {replySuccess && <div className="email-sent-reply-success">✓ {replySuccess}</div>}

            {/* =================================================
                ORIGINAL MESSAGE
            ================================================== */}

            <div className="email-sent-message">
              <span className="email-sent-eyebrow">MESSAGE</span>

              <div className="email-sent-message-body">
                {selectedEmail.message || 'No message provided.'}
              </div>
            </div>

            {/* =================================================
                ATTACHMENTS
            ================================================== */}

            <div className="email-sent-attachments">
              <span className="email-sent-eyebrow">ATTACHMENTS</span>

              {Array.isArray(selectedEmail.attachments) && selectedEmail.attachments.length > 0 ? (
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

            {/* =================================================
                REPLY COMPOSER
            ================================================== */}

            {replyMode ? (
              <form className="email-sent-reply-form" onSubmit={sendReply}>
                <div className="email-sent-reply-header">
                  <div>
                    <span className="email-sent-eyebrow">REPLY</span>

                    <strong>To: {selectedEmail.email}</strong>
                  </div>

                  <span>
                    {selectedEmail.subject?.toLowerCase().startsWith('re:')
                      ? selectedEmail.subject
                      : `Re: ${selectedEmail.subject || 'No Subject'}`}
                  </span>
                </div>

                <textarea
                  className="email-sent-reply-textarea"
                  placeholder="Write your reply..."
                  value={replyMessage}
                  onChange={(event) => setReplyMessage(event.target.value)}
                  rows={7}
                  disabled={replySending}
                  autoFocus
                />

                {replyError && <div className="email-sent-reply-error">! {replyError}</div>}

                <div className="email-sent-reply-actions">
                  <button
                    type="button"
                    className="email-sent-secondary"
                    onClick={cancelReply}
                    disabled={replySending}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="email-sent-reply"
                    disabled={replySending || !replyMessage.trim()}
                  >
                    {replySending ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            ) : (
              /* =================================================
                 ACTIONS
              ================================================== */

              <div className="email-sent-modal-actions">
                <button type="button" className="email-sent-reply" onClick={startReply}>
                  ↩ Reply
                </button>

                <a href={`mailto:${selectedEmail.email}`} className="email-sent-secondary">
                  Open Mail App
                </a>

                <button type="button" className="email-sent-secondary" onClick={closeEmail}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default EmailSent;
