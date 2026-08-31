import React, { useEffect, useMemo, useState } from 'react';

import './EmailAttachments.css';

const API_URL = 'http://localhost:5000';

const EmailAttachments = () => {
  const [emails, setEmails] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  /* =========================================================
     LOAD EMAILS
  ========================================================= */

  const loadEmails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/emails`);

      if (!response.ok) {
        throw new Error('Unable to load emails.');
      }

      const data = await response.json();

      setEmails(data.emails || []);
    } catch (err) {
      console.error('Attachments error:', err);

      setError('Unable to load email attachments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  /* =========================================================
     BUILD ATTACHMENT LIST
  ========================================================= */

  const attachments = useMemo(() => {
    const results = [];

    emails.forEach((email) => {
      if (!email.attachments || !Array.isArray(email.attachments)) {
        return;
      }

      email.attachments.forEach((attachment, index) => {
        results.push({
          ...attachment,
          id: attachment.id || `${email.id}-${index}`,
          emailId: email.id,
          emailName: email.name || email.email || 'Unknown Sender',
          emailAddress: email.email || '-',
          subject: email.subject || 'No subject',
          message: email.message || '',
          createdAt: email.createdAt,
        });
      });
    });

    return results;
  }, [emails]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredAttachments = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return attachments;
    }

    return attachments.filter((attachment) => {
      return (
        attachment.name?.toLowerCase().includes(searchText) ||
        attachment.emailName?.toLowerCase().includes(searchText) ||
        attachment.emailAddress?.toLowerCase().includes(searchText) ||
        attachment.subject?.toLowerCase().includes(searchText) ||
        attachment.path?.toLowerCase().includes(searchText)
      );
    });
  }, [attachments, search]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const emailWithAttachments = useMemo(() => {
    return emails.filter(
      (email) =>
        email.attachments && Array.isArray(email.attachments) && email.attachments.length > 0
    ).length;
  }, [emails]);

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
     FILE TYPE
  ========================================================= */

  const getFileExtension = (fileName = '') => {
    const parts = fileName.split('.');

    if (parts.length < 2) {
      return 'FILE';
    }

    return parts.pop().toUpperCase();
  };

  const getFileIcon = (fileName = '') => {
    const extension = getFileExtension(fileName);

    if (extension === 'PDF') return '📄';

    if (['DOC', 'DOCX', 'ODT', 'RTF'].includes(extension)) {
      return '📝';
    }

    if (['XLS', 'XLSX', 'CSV', 'ODS'].includes(extension)) {
      return '📊';
    }

    if (['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'SVG'].includes(extension)) {
      return '🖼';
    }

    if (['ZIP', 'RAR', '7Z'].includes(extension)) {
      return '🗜';
    }

    return '📎';
  };

  /* =========================================================
     OPEN ATTACHMENT
  ========================================================= */

  const openAttachment = (attachment) => {
    setSelectedAttachment(attachment);
  };

  /* =========================================================
     CLOSE ATTACHMENT
  ========================================================= */

  const closeAttachment = () => {
    setSelectedAttachment(null);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="email-sent-loading">
        <div className="email-sent-spinner"></div>

        <p>Loading attachments...</p>
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
        {/* TOTAL ATTACHMENTS */}

        <div className="email-sent-stat-card">
          <div className="email-sent-stat-icon">📎</div>

          <div>
            <span>Total Attachments</span>

            <strong>{attachments.length}</strong>
          </div>
        </div>

        {/* EMAILS WITH ATTACHMENTS */}

        <div className="email-sent-stat-card">
          <div className="email-sent-stat-icon">✉</div>

          <div>
            <span>Emails With Files</span>

            <strong>{emailWithAttachments}</strong>
          </div>
        </div>

        {/* RESULTS */}

        <div className="email-sent-stat-card">
          <div className="email-sent-stat-icon">≡</div>

          <div>
            <span>Showing</span>

            <strong>{filteredAttachments.length}</strong>
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

            <h2>Attachments</h2>

            <p>View documents and files received through the Greens Shuttle dashboard.</p>
          </div>

          {/* REFRESH */}

          <button type="button" className="email-sent-refresh" onClick={loadEmails}>
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
              placeholder="Search attachments..."
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

        {filteredAttachments.length === 0 ? (
          <div className="email-sent-empty">
            <div className="email-sent-empty-icon">📎</div>

            <h3>No attachments found</h3>

            <p>
              {attachments.length === 0
                ? 'Attachments received through email will appear here.'
                : 'Try changing your search.'}
            </p>
          </div>
        ) : (
          /* =================================================
             ATTACHMENT LIST
          ================================================= */

          <div className="email-sent-list">
            {filteredAttachments.map((attachment) => (
              <button
                type="button"
                key={attachment.id}
                className="email-sent-item"
                onClick={() => openAttachment(attachment)}
              >
                {/* FILE ICON */}

                <div className="email-sent-avatar">{getFileIcon(attachment.name)}</div>

                {/* CONTENT */}

                <div className="email-sent-item-content">
                  <div className="email-sent-item-top">
                    <strong>{attachment.name || 'Attachment'}</strong>

                    <span>{formatDate(attachment.createdAt)}</span>
                  </div>

                  <div className="email-sent-item-subject">{attachment.subject}</div>

                  <div className="email-sent-item-preview">
                    From: {attachment.emailName || attachment.emailAddress || '-'}
                  </div>

                  <div className="email-sent-item-meta">
                    <span>{getFileExtension(attachment.name)}</span>

                    <span>{attachment.emailAddress}</span>
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
          ATTACHMENT MODAL
      ====================================================== */}

      {selectedAttachment && (
        <div className="email-sent-modal-overlay" onClick={closeAttachment}>
          <div className="email-sent-modal" onClick={(event) => event.stopPropagation()}>
            {/* MODAL HEADER */}

            <div className="email-sent-modal-header">
              <div>
                <span className="email-sent-eyebrow">ATTACHMENT</span>

                <h2>{selectedAttachment.name || 'Attachment'}</h2>
              </div>

              <button type="button" className="email-sent-close" onClick={closeAttachment}>
                ×
              </button>
            </div>

            {/* FILE INFORMATION */}

            <div className="email-sent-recipient">
              <div className="email-sent-avatar large">{getFileIcon(selectedAttachment.name)}</div>

              <div>
                <strong>{selectedAttachment.name || 'Attachment'}</strong>

                <span>{getFileExtension(selectedAttachment.name)}</span>

                <span>{formatDateTime(selectedAttachment.createdAt)}</span>
              </div>
            </div>

            {/* SOURCE EMAIL */}

            <div className="email-sent-message">
              <span className="email-sent-eyebrow">EMAIL</span>

              <div className="email-sent-message-body">
                <strong>{selectedAttachment.subject}</strong>
                <br />
                From: {selectedAttachment.emailName || selectedAttachment.emailAddress || '-'}
                <br />
                {selectedAttachment.emailAddress}
              </div>
            </div>

            {/* FILE */}

            <div className="email-sent-attachments">
              <span className="email-sent-eyebrow">FILE</span>

              <div className="email-sent-attachment-list">
                <a
                  href={`${API_URL}${selectedAttachment.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="email-sent-attachment"
                >
                  <span>{getFileIcon(selectedAttachment.name)}</span>

                  <span>{selectedAttachment.name || 'Open attachment'}</span>
                </a>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="email-sent-modal-actions">
              <a
                href={`${API_URL}${selectedAttachment.path}`}
                target="_blank"
                rel="noreferrer"
                className="email-sent-reply"
              >
                Open Attachment
              </a>

              <a
                href={`${API_URL}${selectedAttachment.path}`}
                download={selectedAttachment.name || 'attachment'}
                className="email-sent-secondary"
              >
                Download
              </a>

              <button type="button" className="email-sent-secondary" onClick={closeAttachment}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EmailAttachments;
