import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/documents`);

      if (!response.ok) {
        throw new Error('Unable to load documents.');
      }

      const data = await response.json();

      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Documents error:', err);

      setError('Documents service is not connected yet.');

      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDocumentType = (document) => {
    if (document.type) {
      return document.type;
    }

    if (document.name) {
      const extension = document.name.split('.').pop();

      return extension ? extension.toUpperCase() : 'FILE';
    }

    return 'FILE';
  };

  const openDocument = (document) => {
    if (!document.path) {
      return;
    }

    window.open(`${API_URL}${document.path}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="dashboard-content">
      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && <div className="dashboard-error">{error}</div>}

      {/* =====================================================
          DOCUMENT PANEL
      ===================================================== */}

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <span className="dashboard-section-label">FILES & ATTACHMENTS</span>

            <h2>Uploaded Documents</h2>
          </div>

          <button type="button" className="dashboard-refresh-button" onClick={loadDocuments}>
            ↻ Refresh
          </button>
        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (
          <div className="dashboard-empty">
            <p>Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          /* =====================================================
             EMPTY
          ===================================================== */

          <div className="dashboard-empty">
            <div style={{ fontSize: '28px' }}>▤</div>

            <h3>No documents yet</h3>

            <p>Uploaded proof and customer attachments will appear here.</p>
          </div>
        ) : (
          /* =====================================================
             TABLE
          ===================================================== */

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>DOCUMENT</th>
                  <th>TYPE</th>
                  <th>CUSTOMER</th>
                  <th>SOURCE</th>
                  <th>UPLOADED</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {documents.map((document, index) => (
                  <tr key={document.id || document.path || index}>
                    {/* DOCUMENT */}

                    <td>
                      <strong>{document.name || 'Unnamed document'}</strong>

                      <small>{document.filename || document.path || '-'}</small>
                    </td>

                    {/* TYPE */}

                    <td>
                      <span className="dashboard-status confirmed">
                        {getDocumentType(document)}
                      </span>
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      <div className="dashboard-customer">
                        <strong>{document.customerName || '-'}</strong>

                        <span>{document.customerEmail || '-'}</span>
                      </div>
                    </td>

                    {/* SOURCE */}

                    <td>
                      <span>{document.source || 'Booking'}</span>
                    </td>

                    {/* DATE */}

                    <td>{formatDate(document.createdAt || document.uploadedAt)}</td>

                    {/* VIEW */}

                    <td>
                      <button
                        type="button"
                        className="dashboard-view-button"
                        onClick={() => openDocument(document)}
                        disabled={!document.path}
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
    </div>
  );
};

export default Documents;
