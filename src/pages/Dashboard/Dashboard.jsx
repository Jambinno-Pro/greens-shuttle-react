import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') {
      return 'Dashboard';
    }

    if (location.pathname.startsWith('/dashboard/bookings')) {
      return 'Bookings';
    }

    if (location.pathname.startsWith('/dashboard/contacts')) {
      return 'Contacts';
    }

    if (location.pathname.startsWith('/dashboard/quotes')) {
      return 'Quotes';
    }

    return 'Dashboard';
  };

  const pageTitle = getPageTitle();

  return (
    <div className="dashboard-page">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <img src="/images/GREENS-TRANSPORT-logo.png" alt="Greens Shuttle" />
        </div>

        <nav className="dashboard-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>⌂</span>
            Overview
          </NavLink>

          <NavLink
            to="/dashboard/bookings"
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>▣</span>
            Bookings
          </NavLink>

          <NavLink
            to="/dashboard/contacts"
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>✉</span>
            Contacts
          </NavLink>

          <NavLink
            to="/dashboard/quotes"
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>▤</span>
            Quotes
          </NavLink>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <NavLink to="/" className="dashboard-nav-link">
            <span>←</span>
            Back to Website
          </NavLink>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="dashboard-main">
        {/* =================================================
            DYNAMIC HEADER
        ================================================== */}

        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">GREENS SHUTTLE</span>

            <h1>{pageTitle}</h1>

            <p>
              {pageTitle === 'Dashboard' &&
                "Welcome back. Here's an overview of your shuttle enquiries and bookings."}

              {pageTitle === 'Bookings' && 'View and manage all customer shuttle booking requests.'}

              {pageTitle === 'Contacts' &&
                'View and manage enquiries received through the contact form.'}

              {pageTitle === 'Quotes' && 'View and manage transportation quotation requests.'}
            </p>
          </div>

          <div className="dashboard-header-status">
            <span className="status-dot"></span>
            System Online
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================== */}

        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
