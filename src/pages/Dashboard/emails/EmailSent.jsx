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
     DELETE STATE
  ========================================================= */

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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

      const token = localStorage.getItem('adminToken');

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API_URL}/api/emails/sent`, {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        let message = 'Unable to load sent emails.';

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
    setDeleteError('');
  };

  /* =========================================================
     CLOSE EMAIL
  ========================================================= */

  const closeEmail = () => {
    if (replySending || deleteLoading) {
      return;
    }

    setSelectedEmail(null);

    setReplyMode(false);
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');
    setDeleteError('');
  };

  /* =========================================================
     START REPLY
  ========================================================= */

  const startReply = () => {
    if (!selectedEmail || deleteLoading) {
      return;
    }

    setReplyMode(true);
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');
    setDeleteError('');
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
  };

  /* =========================================================
     SEND REPLY
  ========================================================= */

  const sendReply = async (event) => {
    event.preventDefault();

    if (!selectedEmail) {
      return;
    }

    if (!selectedEmail.email) {
      setReplyError('This email does not have a valid recipient address.');
      return;
    }

    if (!replyMessage.trim()) {
      setReplyError('Please enter a reply message.');
      return;
    }

    const token = localStorage.getItem('adminToken');

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setReplySending(true);
      setReplyError('');
      setReplySuccess('');

      const originalSubject = selectedEmail.subject || 'Your Greens Shuttle enquiry';

      const replySubject = originalSubject.toLowerCase().startsWith('re:')
        ? originalSubject
        : `Re: ${originalSubject}`;

      const formData = new FormData();

      formData.append('email', selectedEmail.email);
      formData.append('name', selectedEmail.name || '');
      formData.append('subject', replySubject);
      formData.append('message', replyMessage.trim());

      const sender =
        selectedEmail.from ||
        (selectedEmail.mailbox === 'bookings'
          ? 'bookings@greensshuttle.co.za'
          : 'info@greensshuttle.co.za');

      formData.append('from', sender);

      const response = await fetch(`${API_URL}/api/emails/send`, {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Unable to send reply.');
      }

      setReplySuccess(data.message || 'Reply sent successfully.');

      setReplyMessage('');
      setReplyMode(false);

      await loadSentEmails();

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
     DELETE SENT EMAIL
  ========================================================= */

  const deleteEmail = async () => {
    if (!selectedEmail) {
      return;
    }

    if (replySending || deleteLoading) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete this sent email?\n\n"${selectedEmail.subject || 'No Subject'}"\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('adminToken');

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError('');
      setError('');

      const response = await fetch(
        `${API_URL}/api/emails/${encodeURIComponent(selectedEmail.id)}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Unable to delete email.');
      }

      /* ================================================
         REMOVE EMAIL FROM CURRENT LIST
      ================================================= */

      setEmails((currentEmails) =>
        currentEmails.filter((email) => String(email.id) !== String(selectedEmail.id))
      );

      /* ================================================
         CLOSE MODAL
      ================================================= */

      setSelectedEmail(null);
      setReplyMode(false);
      setReplyMessage('');
      setReplyError('');
      setReplySuccess('');
      setDeleteError('');
    } catch (err) {
      console.error('Delete email error:', err);

      setDeleteError(err?.message || 'Unable to delete email.');
    } finally {
      setDeleteLoading(false);
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
        <div className="email-sent-panel-header">
          <div>
            <span className="email-sent-eyebrow">EMAILS</span>

            <h2>Sent</h2>

            <p>View emails sent from the Greens Shuttle dashboard.</p>
          </div>

          <button
            type="button"
            className="email-sent-refresh"
            onClick={loadSentEmails}
            disabled={loading}
          >
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
              <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
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
                <div className="email-sent-avatar">
                  {(email.name || email.email || 'G').charAt(0).toUpperCase()}
                </div>

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
            {/* HEADER */}

            <div className="email-sent-modal-header">
              <div>
                <span className="email-sent-eyebrow">SENT EMAIL</span>

                <h2>{selectedEmail.subject || 'No Subject'}</h2>
              </div>

              <button
                type="button"
                className="email-sent-close"
                onClick={closeEmail}
                disabled={replySending || deleteLoading}
                aria-label="Close email"
              >
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

            {/* SUCCESS */}

            {replySuccess && <div className="email-sent-reply-success">✓ {replySuccess}</div>}

            {/* DELETE ERROR */}

            {deleteError && <div className="email-sent-reply-error">! {deleteError}</div>}

            {/* ORIGINAL MESSAGE */}

            <div className="email-sent-message">
              <span className="email-sent-eyebrow">MESSAGE</span>

              <div className="email-sent-message-body">
                {selectedEmail.message || 'No message provided.'}
              </div>
            </div>

            {/* ATTACHMENTS */}

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
              <div className="email-sent-modal-actions">
                <button
                  type="button"
                  className="email-sent-reply"
                  onClick={startReply}
                  disabled={deleteLoading}
                >
                  ↩ Reply
                </button>

                <a href={`mailto:${selectedEmail.email}`} className="email-sent-secondary">
                  Open Mail App
                </a>

                {/* =================================================
                    DELETE BUTTON
                ================================================== */}

                <button
                  type="button"
                  className="email-sent-delete"
                  onClick={deleteEmail}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>

                <button
                  type="button"
                  className="email-sent-secondary"
                  onClick={closeEmail}
                  disabled={deleteLoading}
                >
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
