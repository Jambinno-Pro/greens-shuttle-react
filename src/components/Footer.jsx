import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* =====================================================
          FOOTER CTA
      ====================================================== */}
      <section className="footer-cta">
        <div className="container">
          <div className="footer-cta-inner">
            <div className="footer-cta-content">
              <span className="footer-eyebrow">READY TO TRAVEL?</span>

              <h2>
                Let's get you
                <span> where you need to go.</span>
              </h2>
            </div>

            <Link to="/booking" className="footer-cta-button">
              <span>PLAN YOUR JOURNEY</span>

              <span className="footer-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}
      <section className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* =================================================
                BRAND
            ================================================== */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo" aria-label="Greens Shuttle Home">
                <img
                  src="/images/GREENS-TRANSPORT-logo.png"
                  alt="Greens Shuttle"
                  className="footer-logo-image"
                />
              </Link>

              <p>
                Reliable and comfortable shuttle services, airport transfers, private tours and
                group transportation across Cape Town, the Western Cape and South Africa.
              </p>

              {/* SOCIAL MEDIA */}
              <div className="footer-socials">
                <a href="#" aria-label="Facebook">
                  FB
                </a>

                <a href="#" aria-label="Instagram">
                  IG
                </a>

                <a href="#" aria-label="WhatsApp">
                  WA
                </a>
              </div>
            </div>

            {/* =================================================
                EXPLORE
            ================================================== */}
            <div className="footer-column">
              <h4>EXPLORE</h4>

              <Link to="/">Home</Link>

              <Link to="/services">Services</Link>

              <Link to="/destinations">Destinations</Link>

              <Link to="/about">About Us</Link>

              <Link to="/gallery">Gallery</Link>

              <Link to="/contact">Contact</Link>
            </div>

            {/* =================================================
                SERVICES
            ================================================== */}
            <div className="footer-column">
              <h4>SERVICES</h4>

              <Link to="/services">Airport Transfers</Link>

              <Link to="/services">Private Tours</Link>

              <Link to="/services">Group Transport</Link>

              <Link to="/services">Wine Tours</Link>

              <Link to="/services">Game Drives</Link>

              <Link to="/services">Events Transfer</Link>
            </div>

            {/* =================================================
                CONTACT
            ================================================== */}
            <div className="footer-column footer-contact">
              <h4>CONTACT</h4>

              <a href="tel:+27211234567">+27 21 123 4567</a>

              <a href="mailto:info@greensshuttle.co.za">info@greensshuttle.co.za</a>

              <p>
                Cape Town
                <br />
                Western Cape
                <br />
                South Africa
              </p>
            </div>
          </div>

          {/* =================================================
              BOTTOM BAR
          ================================================== */}
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Greens Shuttle. All rights reserved.</span>

            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>

              <Link to="/terms">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
