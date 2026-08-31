import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiry: '',
    message: '',
  });

  const [status, setStatus] = useState({
    type: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      type: '',
      message: '',
    });

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send your message.');
      }

      setStatus({
        type: 'success',
        message: 'Your message has been sent successfully.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        enquiry: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact form error:', error);

      setStatus({
        type: 'error',
        message: error.message || 'Unable to send your message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-overlay">
          <div className="contact-hero-content">
            <span className="section-eyebrow">GET IN TOUCH</span>

            <h1>
              Let's talk about
              <span> your journey.</span>
            </h1>

            <p>
              Whether you need an airport transfer, private tour, group transport, or simply have a
              question, our team is ready to help you plan your journey.
            </p>

            <a href="#contact-form" className="contact-hero-btn">
              Send an Enquiry
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT INFORMATION */}
      <section className="contact-info-section">
        <div className="contact-container">
          <div className="contact-section-heading">
            <span className="section-eyebrow">CONTACT US</span>

            <h2>
              We're here to
              <span> help.</span>
            </h2>

            <p>
              Reach out to us directly or send an enquiry using the form below. We'll get back to
              you as soon as possible.
            </p>
          </div>

          <div className="contact-info-grid">
            {/* PHONE */}
            <a href="tel:+27211234567" className="contact-info-card">
              <div className="contact-info-icon">☎</div>

              <div>
                <span>CALL US</span>
                <h3>+27 21 123 4567</h3>
                <p>Speak directly with our team</p>
              </div>
            </a>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/27211234567"
              className="contact-info-card"
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-info-icon">◉</div>

              <div>
                <span>WHATSAPP</span>
                <h3>Chat with us</h3>
                <p>Send us a WhatsApp message</p>
              </div>
            </a>

            {/* EMAIL */}
            <a href="mailto:info@greensshuttle.co.za" className="contact-info-card">
              <div className="contact-info-icon">✉</div>

              <div>
                <span>EMAIL US</span>
                <h3>info@greensshuttle.co.za</h3>
                <p>Send us your enquiry</p>
              </div>
            </a>

            {/* LOCATION */}
            <div className="contact-info-card">
              <div className="contact-info-icon">◎</div>

              <div>
                <span>LOCATION</span>
                <h3>Cape Town</h3>
                <p>Western Cape, South Africa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="contact-form-section" id="contact-form">
        <div className="contact-container">
          <div className="contact-form-wrapper">
            {/* FORM INTRO */}
            <div className="contact-form-intro">
              <span className="section-eyebrow">SEND AN ENQUIRY</span>

              <h2>
                How can we
                <span> help you?</span>
              </h2>

              <p>
                Tell us a little about what you need and our team will get back to you with the
                information you need.
              </p>
            </div>

            {/* FORM */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="name">Full Name</label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="email">Email Address</label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="phone">Phone Number</label>

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+27 ..."
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="enquiry">Enquiry Type</label>

                  <select
                    id="enquiry"
                    name="enquiry"
                    value={formData.enquiry}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select an enquiry
                    </option>

                    <option value="airport-transfer">Airport Transfer</option>

                    <option value="private-tour">Private Tour</option>

                    <option value="group-transport">Group Transport</option>

                    <option value="corporate">Corporate Travel</option>

                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="message">Message</label>

                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* STATUS MESSAGE */}
              {status.message && (
                <div className={`contact-form-status ${status.type}`} role="alert">
                  {status.message}
                </div>
              )}

              <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}

                {!isSubmitting && <span>→</span>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* MAP / LOCATION */}
      <section className="contact-location-section">
        <div className="contact-location-content">
          <span className="section-eyebrow">FIND US</span>

          <h2>
            Based in
            <span> Cape Town.</span>
          </h2>

          <p>Serving Cape Town, the Western Cape and destinations across South Africa.</p>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Cape+Town+South+Africa"
            target="_blank"
            rel="noreferrer"
            className="map-btn"
          >
            Open in Google Maps
            <span>↗</span>
          </a>
        </div>

        <div className="contact-map-placeholder">
          <div className="map-pin">
            <span>◎</span>
            <p>Cape Town</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="contact-cta">
        <div className="contact-cta-overlay">
          <div className="contact-cta-content">
            <span className="section-eyebrow">READY TO TRAVEL?</span>

            <h2>
              Let's get you
              <span> where you need to go.</span>
            </h2>

            <p>
              Planning your next journey? Get in touch with Greens Shuttle and let us take care of
              the road ahead.
            </p>

            <a href="/booking" className="contact-cta-btn">
              Plan Your Journey
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
