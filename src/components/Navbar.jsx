import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* =====================================================
              LOGO
          ====================================================== */}

          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <img src="/images/GREENS-TRANSPORT-logo.png" alt="Greens Shuttle" />
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}

          <nav className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/destinations">Destinations</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          {/* =====================================================
              DESKTOP ADMIN LOGIN
              Positioned between Contact and Booking button
          ====================================================== */}

          <Link
            to="/login"
            className="navbar-login"
            onClick={closeMenu}
            aria-label="Admin Login"
            title="Admin Login"
          >
            <UserRound size={21} strokeWidth={2} />
          </Link>

          {/* =====================================================
              DESKTOP BOOKING BUTTON
          ====================================================== */}

          <Link to="/booking" className="navbar-book">
            <span>BOOK YOUR JOURNEY</span>

            <span className="navbar-book-arrow">→</span>
          </Link>

          {/* =====================================================
              MOBILE MENU BUTTON
          ====================================================== */}

          <button
            type="button"
            className={`navbar-menu ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
          </button>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}

        <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/services" onClick={closeMenu}>
            Services
          </Link>

          <Link to="/destinations" onClick={closeMenu}>
            Destinations
          </Link>

          <Link to="/about" onClick={closeMenu}>
            About
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <Link to="/booking" className="mobile-booking" onClick={closeMenu}>
            <span>BOOK YOUR JOURNEY</span>
            <span>→</span>
          </Link>

          {/* =====================================================
              MOBILE ADMIN LOGIN
              Kept inside the mobile menu
          ====================================================== */}

          <Link to="/login" className="mobile-login" onClick={closeMenu}>
            <UserRound size={18} strokeWidth={2} />

            <span>Admin Login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
