import React from 'react';

const DashboardHeader = ({ activePage }) => {
  const pageTitles = {
    overview: {
      title: 'Dashboard Overview',
      description: 'Manage your Greens Shuttle requests and activity.',
    },
    bookings: {
      title: 'Bookings',
      description: 'View and manage customer booking requests.',
    },
    contacts: {
      title: 'Contact Enquiries',
      description: 'View messages and enquiries from your customers.',
    },
    quotes: {
      title: 'Quote Requests',
      description: 'View and manage customer quote requests.',
    },
  };

  const currentPage = pageTitles[activePage] || pageTitles.overview;

  return (
    <header className="dashboard-header">
      {/* PAGE INFORMATION */}
      <div className="dashboard-header-content">
        <span className="dashboard-header-eyebrow">GREENS SHUTTLE ADMIN</span>

        <h1>{currentPage.title}</h1>

        <p>{currentPage.description}</p>
      </div>

      {/* HEADER RIGHT */}
      <div className="dashboard-header-actions">
        <div className="dashboard-status">
          <span className="dashboard-status-dot"></span>

          <span>System Online</span>
        </div>

        <div className="dashboard-admin">
          <div className="dashboard-admin-avatar">GS</div>

          <div className="dashboard-admin-info">
            <strong>Admin</strong>
            <span>Greens Shuttle</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
