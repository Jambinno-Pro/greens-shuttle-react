import { useState } from 'react';
import './Booking.css';

export default function Booking() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    passengers: '',
    pickup: '',
    destination: '',
    travelDate: '',
    travelTime: '',
    service: '',
    message: '',
  });

  const [status, setStatus] = useState({
    loading: false,
    success: '',
    error: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      loading: true,
      success: '',
      error: '',
    });

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit booking.');
      }

      console.log('BOOKING SUBMITTED:', data);

      setStatus({
        loading: false,
        success: data.message || 'Booking request submitted successfully.',
        error: '',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        passengers: '',
        pickup: '',
        destination: '',
        travelDate: '',
        travelTime: '',
        service: '',
        message: '',
      });
    } catch (error) {
      console.error('Booking submission error:', error);

      setStatus({
        loading: false,
        success: '',
        error: error.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <main className="journey-booking-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="journey-booking-hero">
        <div className="journey-booking-hero-overlay">
          <div className="journey-booking-hero-content">
            <span className="journey-booking-eyebrow">BOOK YOUR JOURNEY</span>

            <h1>
              Tell us where
              <span> you need to go.</span>
            </h1>

            <p>
              Complete the form below and our team will get back to you to confirm your journey and
              provide the details you need.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOOKING AREA
      ===================================================== */}

      <section className="journey-booking-area">
        <div className="journey-booking-layout">
          {/* =================================================
              INTRO
          ================================================= */}

          <div className="journey-booking-intro">
            <span className="journey-booking-section-label">REQUEST A BOOKING</span>

            <h2>
              Plan your
              <span> journey.</span>
            </h2>

            <p className="journey-booking-description">
              Give us the details of your trip and we'll help arrange the right transport for you.
            </p>

            <div className="journey-booking-help">
              <div className="journey-booking-help-icon">✓</div>

              <div className="journey-booking-help-content">
                <h3>Need help?</h3>

                <p>If you're unsure about any part of your booking, contact our team directly.</p>

                <a href="tel:0659112811">065 911 2811</a>
              </div>
            </div>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form className="journey-booking-form" onSubmit={handleSubmit}>
            {/* =================================================
                PERSONAL DETAILS
            ================================================= */}

            <div className="journey-booking-form-title">
              <span>01</span>

              <div>
                <h3>Your details</h3>
                <p>Tell us how we can contact you.</p>
              </div>
            </div>

            <div className="journey-booking-fields">
              {/* NAME */}
              <div className="journey-booking-field">
                <label htmlFor="journey-full-name">Full Name</label>

                <input
                  id="journey-full-name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="journey-booking-field">
                <label htmlFor="journey-email">Email Address</label>

                <input
                  id="journey-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PHONE */}
              <div className="journey-booking-field">
                <label htmlFor="journey-phone">Contact Number</label>

                <input
                  id="journey-phone"
                  name="phone"
                  type="tel"
                  placeholder="065 911 2811"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSENGERS */}
              <div className="journey-booking-field">
                <label htmlFor="journey-passengers">Number of Passengers</label>

                <input
                  id="journey-passengers"
                  name="passengers"
                  type="number"
                  min="1"
                  placeholder="e.g. 4"
                  value={formData.passengers}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* =================================================
                JOURNEY DETAILS
            ================================================= */}

            <div className="journey-booking-form-title">
              <span>02</span>

              <div>
                <h3>Journey details</h3>
                <p>Tell us about your trip.</p>
              </div>
            </div>

            <div className="journey-booking-fields">
              {/* PICKUP */}
              <div className="journey-booking-field">
                <label htmlFor="journey-pickup">Pickup Location</label>

                <input
                  id="journey-pickup"
                  name="pickup"
                  type="text"
                  placeholder="Where should we collect you?"
                  value={formData.pickup}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* DESTINATION */}
              <div className="journey-booking-field">
                <label htmlFor="journey-destination">Destination</label>

                <input
                  id="journey-destination"
                  name="destination"
                  type="text"
                  placeholder="Where are you going?"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* DATE */}
              <div className="journey-booking-field">
                <label htmlFor="journey-date">Travel Date</label>

                <input
                  id="journey-date"
                  name="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* TIME */}
              <div className="journey-booking-field">
                <label htmlFor="journey-time">Pickup Time</label>

                <input
                  id="journey-time"
                  name="travelTime"
                  type="time"
                  value={formData.travelTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* SERVICE */}
              <div className="journey-booking-field journey-booking-field-wide">
                <label htmlFor="journey-service">Service Required</label>

                <select
                  id="journey-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a service
                  </option>

                  <option value="airport-transfer">Airport Transfer</option>

                  <option value="wine-tour">Wine Tour</option>

                  <option value="dinner-transfer">Dinner Transfer</option>

                  <option value="wedding">Wedding Transport</option>

                  <option value="event">Event Transport</option>

                  <option value="chauffeur">Chauffeur Service</option>

                  <option value="private-transfer">Private Transfer</option>

                  <option value="group-transport">Group Transport</option>
                </select>
              </div>
            </div>

            {/* =================================================
                ADDITIONAL INFORMATION
            ================================================= */}

            <div className="journey-booking-form-title">
              <span>03</span>

              <div>
                <h3>Anything else?</h3>

                <p>Let us know if there are any special requirements.</p>
              </div>
            </div>

            <div className="journey-booking-field journey-booking-message">
              <label htmlFor="journey-message">Additional Information</label>

              <textarea
                id="journey-message"
                name="message"
                rows="6"
                placeholder="Tell us anything else we should know about your journey..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {/* =================================================
                STATUS MESSAGE
            ================================================= */}

            {status.success && <div className="journey-booking-success">{status.success}</div>}

            {status.error && <div className="journey-booking-error">{status.error}</div>}

            {/* =================================================
                SUBMIT
            ================================================= */}

            <div className="journey-booking-submit">
              <p>
                By submitting this form, you are requesting a booking. Our team will contact you to
                confirm availability.
              </p>

              <button className="journey-booking-button" type="submit" disabled={status.loading}>
                <span>{status.loading ? 'Submitting...' : 'Submit Booking Request'}</span>

                <strong>→</strong>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* =====================================================
          QUICK CONTACT
      ===================================================== */}

      <section className="journey-booking-contact">
        <div className="journey-booking-contact-inner">
          <span className="journey-booking-eyebrow">NEED ASSISTANCE?</span>

          <h2>
            Prefer to speak
            <span> with us?</span>
          </h2>

          <p>
            Our team is available to help you with your journey, answer questions and assist with
            your booking.
          </p>

          <div className="journey-booking-actions">
            <a href="tel:0659112811" className="journey-booking-action">
              Call 065 911 2811
            </a>

            <a
              href="https://wa.me/27659112811"
              target="_blank"
              rel="noreferrer"
              className="journey-booking-action journey-booking-whatsapp"
            >
              WhatsApp Us
            </a>

            <a
              href="mailto:info@greensshuttle.co.za"
              className="journey-booking-action journey-booking-email"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
