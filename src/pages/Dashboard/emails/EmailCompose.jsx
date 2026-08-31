import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './EmailCompose.css';

const API_URL = 'http://localhost:5000';

const EmailCompose = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    from: 'info@greensshuttle.co.za',
    email: '',
    name: '',
    subject: '',
    message: '',
  });

  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =====================================================
     FILE SELECT
  ===================================================== */

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    setAttachments((current) => [...current, ...selectedFiles]);

    event.target.value = '';
  };

  /* =====================================================
     REMOVE FILE
  ===================================================== */

  const removeAttachment = (index) => {
    setAttachments((current) => current.filter((_, fileIndex) => fileIndex !== index));
  };

  /* =====================================================
     FILE SIZE
  ===================================================== */

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return '0 KB';
    }

    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /* =====================================================
     SEND EMAIL
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');
    setMessageType('');

    if (!form.from.trim()) {
      setMessage('Please select a sending email address.');
      setMessageType('error');
      return;
    }

    if (!form.email.trim()) {
      setMessage('Please enter the recipient email address.');
      setMessageType('error');
      return;
    }

    if (!form.subject.trim()) {
      setMessage('Please enter an email subject.');
      setMessageType('error');
      return;
    }

    if (!form.message.trim()) {
      setMessage('Please enter a message.');
      setMessageType('error');
      return;
    }

    try {
      setSending(true);

      const formData = new FormData();

      formData.append('from', form.from.trim());
      formData.append('email', form.email.trim());
      formData.append('name', form.name.trim());
      formData.append('subject', form.subject.trim());
      formData.append('message', form.message);

      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await fetch(`${API_URL}/api/emails/send`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send email.');
      }

      setMessage(data.message || 'Email sent successfully.');
      setMessageType('success');

      setForm({
        from: form.from,
        email: '',
        name: '',
        subject: '',
        message: '',
      });

      setAttachments([]);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      console.error('Send email error:', error);

      setMessage(error.message || 'Unable to send email. Please try again.');

      setMessageType('error');
    } finally {
      setSending(false);
    }
  };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main className="email-compose-page">
      {/* SUCCESS / ERROR MESSAGE */}

      {message && (
        <div className={`email-compose-message ${messageType}`}>
          <span>{messageType === 'success' ? '✓' : '!'}</span>

          <p>{message}</p>
        </div>
      )}

      {/* MAIN PANEL */}

      <section className="email-compose-panel">
        {/* PANEL HEADER */}

        <div className="email-compose-panel-header">
          <div>
            <span className="email-compose-eyebrow">EMAILS</span>

            <h2>Compose Email</h2>

            <p>
              Create and send an email directly to a customer from the Greens Shuttle dashboard.
            </p>
          </div>
        </div>

        {/* FORM */}

        <form className="email-compose-form" onSubmit={handleSubmit}>
          {/* SENDER + RECIPIENT */}

          <div className="email-compose-recipient-row">
            {/* SEND FROM */}

            <div className="email-compose-field">
              <label htmlFor="from">
                Send From <span>*</span>
              </label>

              <select
                id="from"
                name="from"
                className="email-compose-input"
                value={form.from}
                onChange={handleChange}
                required
              >
                <option value="info@greensshuttle.co.za">info@greensshuttle.co.za</option>

                <option value="bookings@greensshuttle.co.za">bookings@greensshuttle.co.za</option>
              </select>
            </div>

            {/* RECIPIENT */}

            <div className="email-compose-field">
              <label htmlFor="email">
                Recipient Email <span>*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                className="email-compose-input"
                placeholder="customer@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* CUSTOMER NAME */}

          <div className="email-compose-field">
            <label htmlFor="name">Customer Name</label>

            <input
              id="name"
              name="name"
              type="text"
              className="email-compose-input"
              placeholder="Customer name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

          {/* SUBJECT */}

          <div className="email-compose-field">
            <label htmlFor="subject">
              Subject <span>*</span>
            </label>

            <input
              id="subject"
              name="subject"
              type="text"
              className="email-compose-input"
              placeholder="Enter email subject..."
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          {/* MESSAGE */}

          <div className="email-compose-field">
            <label htmlFor="message">
              Message <span>*</span>
            </label>

            <textarea
              id="message"
              name="message"
              className="email-compose-textarea"
              placeholder="Write your message..."
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          {/* ATTACHMENTS */}

          <div className="email-compose-attachments">
            <div className="email-compose-attachments-header">
              <div>
                <span className="email-compose-attachments-title">Attachments</span>

                <span className="email-compose-attachments-subtitle">
                  Add documents or files to this email.
                </span>
              </div>

              <label htmlFor="email-attachments" className="email-compose-file-button">
                📎 Choose Files
              </label>

              <input
                id="email-attachments"
                type="file"
                className="email-compose-file-input"
                multiple
                onChange={handleFileChange}
              />
            </div>

            {attachments.length > 0 ? (
              <div className="email-compose-file-list">
                {attachments.map((file, index) => (
                  <div className="email-compose-file" key={`${file.name}-${file.size}-${index}`}>
                    <div className="email-compose-file-icon">📎</div>

                    <div className="email-compose-file-info">
                      <strong>{file.name}</strong>

                      <span>{formatFileSize(file.size)}</span>
                    </div>

                    <button
                      type="button"
                      className="email-compose-file-remove"
                      onClick={() => removeAttachment(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="email-compose-no-files">No attachments added.</div>
            )}
          </div>

          {/* FOOTER */}

          <div className="email-compose-footer">
            <span className="email-compose-footer-note">Sending from {form.from}</span>

            <div className="email-compose-actions">
              <button
                type="button"
                className="email-compose-cancel"
                onClick={() => navigate('/dashboard/emails/inbox')}
                disabled={sending}
              >
                Cancel
              </button>

              <button type="submit" className="email-compose-send" disabled={sending}>
                {sending ? (
                  <>
                    <span>⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span>↗</span>
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default EmailCompose;
