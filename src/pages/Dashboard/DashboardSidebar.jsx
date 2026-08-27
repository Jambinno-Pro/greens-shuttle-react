import React from 'react';

const DashboardSidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '▦',
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: '▣',
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: '✉',
    },
    {
      id: 'quotes',
      label: 'Quotes',
      icon: '▤',
    },
  ];

  return (
    <aside className="dashboard-sidebar">
      {/* LOGO */}
      <div className="dashboard-sidebar-logo">
        <img src="/images/GREENS-TRANSPORT-logo.png" alt="Greens Shuttle" />
      </div>

      {/* NAVIGATION */}
      <nav className="dashboard-nav">
        <div className="dashboard-nav-label">MENU</div>

        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`dashboard-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="dashboard-nav-icon">{item.icon}</span>

            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* BOTTOM */}
      <div className="dashboard-sidebar-bottom">
        <button
          type="button"
          className="dashboard-nav-item dashboard-website-link"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          <span className="dashboard-nav-icon">↗</span>
          <span>View Website</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
