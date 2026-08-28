import React, { useEffect, useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';

import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();

  /* =====================================================
     EMAIL MENU STATE
  ===================================================== */

  const isEmailSection = location.pathname.startsWith('/dashboard/emails');

  const [emailsOpen, setEmailsOpen] = useState(isEmailSection);

  /* =====================================================
     KEEP EMAIL MENU OPEN/CLOSED WITH NAVIGATION
  ===================================================== */

  useEffect(() => {
    if (isEmailSection) {
      setEmailsOpen(true);
    } else {
      setEmailsOpen(false);
    }
  }, [isEmailSection]);

  /* =====================================================
     TOGGLE EMAIL MENU
  ===================================================== */

  const toggleEmails = () => {
    setEmailsOpen((current) => !current);
  };

  /* =====================================================
     PAGE TITLE
  ===================================================== */

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

    if (location.pathname.startsWith('/dashboard/documents')) {
      return 'Documents';
    }

    if (location.pathname.startsWith('/dashboard/emails/inbox')) {
      return 'Email Inbox';
    }

    if (location.pathname.startsWith('/dashboard/emails/sent')) {
      return 'Sent Emails';
    }

    if (location.pathname.startsWith('/dashboard/emails/attachments')) {
      return 'Email Attachments';
    }

    if (location.pathname.startsWith('/dashboard/emails/compose')) {
      return 'Compose Email';
    }

    if (location.pathname.startsWith('/dashboard/emails')) {
      return 'Emails';
    }

    return 'Dashboard';
  };

  const pageTitle = getPageTitle();

  /* =====================================================
     PAGE DESCRIPTION
  ===================================================== */

  const getPageDescription = () => {
    if (pageTitle === 'Dashboard') {
      return "Welcome back. Here's an overview of your shuttle enquiries and bookings.";
    }

    if (pageTitle === 'Bookings') {
      return 'View and manage all customer shuttle booking requests.';
    }

    if (pageTitle === 'Contacts') {
      return 'View and manage enquiries received through the contact form.';
    }

    if (pageTitle === 'Quotes') {
      return 'View and manage transportation quotation requests.';
    }

    if (pageTitle === 'Documents') {
      return 'View and manage documents and files submitted by customers.';
    }

    if (pageTitle === 'Email Inbox') {
      return 'View and manage customer emails received by Greens Shuttle.';
    }

    if (pageTitle === 'Sent Emails') {
      return 'View emails sent from the Greens Shuttle dashboard.';
    }

    if (pageTitle === 'Email Attachments') {
      return 'View and manage files attached to customer emails.';
    }

    if (pageTitle === 'Compose Email') {
      return 'Create and send an email to a customer.';
    }

    if (pageTitle === 'Emails') {
      return 'Manage customer emails, messages, and attachments.';
    }

    return '';
  };

  return (
    <div className="dashboard-page">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">
        {/* =================================================
            LOGO
        ================================================= */}

        <div className="dashboard-logo">
          <img src="/images/GREENS-TRANSPORT-logo.png" alt="Greens Shuttle" />
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="dashboard-nav">
          {/* =================================================
              OVERVIEW
          ================================================= */}

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>⌂</span>
            Overview
          </NavLink>

          {/* =================================================
              BOOKINGS
          ================================================= */}

          <NavLink
            to="/dashboard/bookings"
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>▣</span>
            Bookings
          </NavLink>

          {/* =================================================
              CONTACTS
          ================================================= */}

          <NavLink
            to="/dashboard/contacts"
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>✉</span>
            Contacts
          </NavLink>

          {/* =================================================
              QUOTES
          ================================================= */}

          <NavLink
            to="/dashboard/quotes"
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>▤</span>
            Quotes
          </NavLink>

          {/* =================================================
              DOCUMENTS
          ================================================= */}

          <NavLink
            to="/dashboard/documents"
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>▤</span>
            Documents
          </NavLink>

          {/* =================================================
              EMAILS
          ================================================= */}

          <div className="dashboard-email-section">
            {/* EMAIL MAIN BUTTON */}

            <button
              type="button"
              className={`dashboard-nav-link dashboard-email-main ${
                isEmailSection ? 'active' : ''
              }`}
              onClick={toggleEmails}
              aria-expanded={emailsOpen}
            >
              <span>✉</span>

              <span className="dashboard-email-title">Emails</span>

              <span className="dashboard-email-chevron">{emailsOpen ? '⌃' : '⌄'}</span>
            </button>

            {/* =================================================
                EMAIL SUBMENU
            ================================================= */}

            {emailsOpen && (
              <div className="dashboard-email-subnav">
                {/* INBOX */}

                <NavLink
                  to="/dashboard/emails/inbox"
                  className={({ isActive }) =>
                    `dashboard-email-sub-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="dashboard-email-sub-icon">•</span>
                  Inbox
                </NavLink>

                {/* SENT */}

                <NavLink
                  to="/dashboard/emails/sent"
                  className={({ isActive }) =>
                    `dashboard-email-sub-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="dashboard-email-sub-icon">↗</span>
                  Sent
                </NavLink>

                {/* ATTACHMENTS */}

                <NavLink
                  to="/dashboard/emails/attachments"
                  className={({ isActive }) =>
                    `dashboard-email-sub-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="dashboard-email-sub-icon">📎</span>
                  Attachments
                </NavLink>

                {/* COMPOSE */}

                <NavLink
                  to="/dashboard/emails/compose"
                  className={({ isActive }) =>
                    `dashboard-email-sub-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="dashboard-email-sub-icon">+</span>
                  Compose
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* =====================================================
            SIDEBAR BOTTOM
        ===================================================== */}

        <div className="dashboard-sidebar-bottom">
          <Link to="/" className="dashboard-nav-link">
            <span>←</span>
            Back to Website
          </Link>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="dashboard-main">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">GREENS SHUTTLE</span>

            <h1>{pageTitle}</h1>

            <p>{getPageDescription()}</p>
          </div>

          {/* SYSTEM STATUS */}

          <div className="dashboard-header-status">
            <span className="status-dot"></span>
            System Online
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
