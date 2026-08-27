import React from 'react';

const Quotes = () => {
  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <span className="dashboard-section-label">QUOTES</span>
          <h2>Quote Requests</h2>
        </div>
      </div>

      <div className="dashboard-empty">
        <div>▤</div>
        <h3>No quote requests yet</h3>
        <p>Customers requesting transportation quotations will appear here.</p>
      </div>
    </div>
  );
};

export default Quotes;
