import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import './About.css';

const API_URL = 'http://localhost:5000';

export default function About() {
  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    travelDate: '',
    travelTime: '',
    passengers: '',
    name: '',
    phone: '',
    email: '',
    service: 'general-booking',
    message: '',
  });

  const [proofFile, setProofFile] = useState(null);

  const [status, setStatus] = useState({
    loading: false,
    success: '',
    error: '',
  });

  /* =========================================================
     HANDLE TEXT / SELECT INPUTS
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     HANDLE PROOF FILE
  ========================================================= */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setProofFile(file);

    setStatus({
      loading: false,
      success: '',
      error: '',
    });
  };

  /* =========================================================
     SUBMIT BOOKING
  ========================================================= */

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      loading: true,
      success: '',
      error: '',
    });

    try {
      /*
        IMPORTANT:
        We use FormData because the form contains
        a file upload.
      */

      const bookingData = new FormData();

      bookingData.append('pickup', formData.pickup);
      bookingData.append('destination', formData.destination);
      bookingData.append('travelDate', formData.travelDate);
      bookingData.append('travelTime', formData.travelTime);
      bookingData.append('passengers', formData.passengers);

      bookingData.append('name', formData.name);
      bookingData.append('phone', formData.phone);
      bookingData.append('email', formData.email);

      bookingData.append('service', formData.service);
      bookingData.append('message', formData.message);

      /*
        Add proof file if the customer selected one.
      */

      if (proofFile) {
        bookingData.append('proofOfBooking', proofFile);
      }

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        body: bookingData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit booking.');
      }

      console.log('ABOUT BOOKING SUBMITTED:', data);

      setStatus({
        loading: false,
        success: data.message || 'Your booking request has been sent successfully.',
        error: '',
      });

      /* =====================================================
         RESET FORM
      ===================================================== */

      setFormData({
        pickup: '',
        destination: '',
        travelDate: '',
        travelTime: '',
        passengers: '',
        name: '',
        phone: '',
        email: '',
        service: 'general-booking',
        message: '',
      });

      /* Remove selected proof file */

      setProofFile(null);

      /* Reset actual file input */

      e.target.reset();
    } catch (error) {
      console.error('About booking submission error:', error);

      setStatus({
        loading: false,
        success: '',
        error: error.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <main className="about-page">
      {/* =====================================================
          ABOUT HERO
      ===================================================== */}

      <section className="about-page-hero">
        <div className="about-page-hero-overlay">
          <div className="container">
            <span className="about-page-eyebrow">GREENS SHUTTLE</span>

            <h1>
              Travel comfortably.
              <span> Experience more.</span>
            </h1>

            <p>
              Private transportation and unforgettable travel experiences across Cape Town and South
              Africa.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="about-intro section">
        <div className="container">
          <div className="about-intro-grid">
            <div className="about-intro-heading">
              <span className="section-eyebrow">ABOUT GREENS SHUTTLE</span>

              <h2>
                More than a shuttle.
                <span> It's your journey.</span>
              </h2>
            </div>

            <div className="about-intro-content">
              <p>
                Greens Shuttle provides comfortable, reliable and personalised transportation for
                travellers exploring Cape Town and beyond.
              </p>

              <p>
                From airport transfers and private tours to longer journeys across South Africa, we
                make getting there effortless.
              </p>

              <p>
                Our focus is simple: dependable service, comfortable travel and experiences that
                allow you to enjoy more of your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <section className="about-why section">
        <div className="container">
          <SectionTitle
            eyebrow="WHY CHOOSE US"
            title="Travel with confidence."
            text="We take care of the journey so you can focus on the destination."
          />

          <div className="about-why-grid">
            <article className="about-why-card">
              <span className="about-why-number">01</span>

              <h3>Reliable Transfers</h3>

              <p>
                From airport pickups to private transfers, we focus on dependable service and making
                sure your journey runs smoothly.
              </p>
            </article>

            <article className="about-why-card">
              <span className="about-why-number">02</span>

              <h3>Personalised Service</h3>

              <p>
                Every traveller is different. We tailor our service around your plans, schedule and
                destination.
              </p>
            </article>

            <article className="about-why-card">
              <span className="about-why-number">03</span>

              <h3>Comfortable Travel</h3>

              <p>
                Sit back, relax and enjoy the journey with transportation designed around comfort
                and convenience.
              </p>
            </article>

            <article className="about-why-card">
              <span className="about-why-number">04</span>

              <h3>Local Experience</h3>

              <p>
                Discover more of Cape Town, the Winelands, Garden Route and South Africa with local
                travel experiences.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          EXPERIENCE
      ===================================================== */}

      <section className="about-experience">
        <div className="about-experience-image">
          <img src="/images/about/greens-experience.jpg" alt="Greens Shuttle travel experience" />
        </div>

        <div className="about-experience-content">
          <span className="section-eyebrow">THE GREENS EXPERIENCE</span>

          <h2>
            Your journey
            <br />
            <span>matters to us.</span>
          </h2>

          <p>
            Whether you're travelling for business, enjoying a holiday with family or discovering
            South Africa for the first time, Greens Shuttle is here to make every journey
            comfortable and memorable.
          </p>

          <p>
            We believe transportation should be more than simply getting from one place to another.
            It should be part of the experience.
          </p>
        </div>
      </section>

      {/* =====================================================
          MISSION & VISION
      ===================================================== */}

      <section className="about-mission-vision section">
        <div className="container">
          <div className="about-mission-vision-grid">
            <article className="about-purpose-card">
              <span className="section-eyebrow">OUR MISSION</span>

              <h2>
                Making every journey
                <span> comfortable and effortless.</span>
              </h2>

              <p>
                Our mission is to provide reliable, comfortable and personalised transportation that
                makes every journey easier and more enjoyable.
              </p>

              <p>
                From the moment you book with us to the moment you reach your destination, we aim to
                deliver a service you can trust.
              </p>
            </article>

            <article className="about-purpose-card">
              <span className="section-eyebrow">OUR VISION</span>

              <h2>
                Connecting people
                <span> with extraordinary places.</span>
              </h2>

              <p>
                We envision Greens Shuttle as a trusted travel partner for visitors and locals
                exploring Cape Town and destinations across South Africa.
              </p>

              <p>Our goal is to make discovering new places simple, comfortable and memorable.</p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE VALUES
      ===================================================== */}

      <section className="about-values section">
        <div className="container">
          <SectionTitle
            eyebrow="OUR CORE VALUES"
            title="What matters to us."
            text="Our values guide the way we serve every traveller and shape every journey."
          />

          <div className="about-values-grid">
            <article className="about-value-card">
              <span className="about-value-number">01</span>

              <h3>Comfort</h3>

              <p>
                We believe travelling should be enjoyable. We focus on creating a comfortable
                experience from pickup to destination.
              </p>
            </article>

            <article className="about-value-card">
              <span className="about-value-number">02</span>

              <h3>Reliability</h3>

              <p>
                We value punctuality, dependability and keeping our commitments to every traveller.
              </p>
            </article>

            <article className="about-value-card">
              <span className="about-value-number">03</span>

              <h3>Personal Service</h3>

              <p>
                We treat every journey individually and provide service that is attentive, friendly
                and tailored to your needs.
              </p>
            </article>

            <article className="about-value-card">
              <span className="about-value-number">04</span>

              <h3>Experience</h3>

              <p>
                We want you to experience more than just transportation. Every journey is an
                opportunity to discover something new.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="about-stats">
        <div className="container">
          <div className="about-stats-grid">
            <div className="about-stat">
              <strong>24/7</strong>
              <span>Availability</span>
            </div>

            <div className="about-stat">
              <strong>100%</strong>
              <span>Personal Service</span>
            </div>

            <div className="about-stat">
              <strong>CAPE</strong>
              <span>&amp; Beyond</span>
            </div>

            <div className="about-stat">
              <strong>∞</strong>
              <span>Possibilities</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOOKING CTA
      ===================================================== */}

      <section className="about-cta">
        <div className="about-cta-overlay">
          <div className="about-booking-card">
            {/* =================================================
                FORM HEADER
            ================================================= */}

            <div className="about-booking-header">
              <span className="section-eyebrow">PLAN YOUR JOURNEY</span>

              <h2>
                Let's get you
                <span> where you need to go.</span>
              </h2>

              <p>
                Tell us a little about your journey and our team will get back to you with the best
                travel option.
              </p>
            </div>

            {/* =================================================
                BOOKING FORM
            ================================================= */}

            <form
              className="about-booking-form"
              onSubmit={handleBookingSubmit}
              encType="multipart/form-data"
            >
              {/* =================================================
                  PICKUP
              ================================================= */}

              <div className="about-form-group">
                <label htmlFor="about-pickup">Pick-up Location</label>

                <input
                  id="about-pickup"
                  type="text"
                  name="pickup"
                  placeholder="Where are you travelling from?"
                  value={formData.pickup}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* =================================================
                  DESTINATION
              ================================================= */}

              <div className="about-form-group">
                <label htmlFor="about-destination">Destination</label>

                <input
                  id="about-destination"
                  type="text"
                  name="destination"
                  placeholder="Where are you going?"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* =================================================
                  DATE & TIME
              ================================================= */}

              <div className="about-form-row">
                <div className="about-form-group">
                  <label htmlFor="about-travel-date">Travel Date</label>

                  <input
                    id="about-travel-date"
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="about-form-group">
                  <label htmlFor="about-travel-time">Travel Time</label>

                  <input
                    id="about-travel-time"
                    type="time"
                    name="travelTime"
                    value={formData.travelTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* =================================================
                  PASSENGERS
              ================================================= */}

              <div className="about-form-group">
                <label htmlFor="about-passengers">Passengers</label>

                <select
                  id="about-passengers"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select passengers
                  </option>

                  <option value="1">1 Passenger</option>

                  <option value="2">2 Passengers</option>

                  <option value="3">3 Passengers</option>

                  <option value="4">4 Passengers</option>

                  <option value="5">5 Passengers</option>

                  <option value="6">6 Passengers</option>

                  <option value="7">7 Passengers</option>

                  <option value="8">8+ Passengers</option>
                </select>
              </div>

              {/* =================================================
                  CONTACT DETAILS
              ================================================= */}

              <div className="about-form-row">
                <div className="about-form-group">
                  <label htmlFor="about-name">Full Name</label>

                  <input
                    id="about-name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="about-form-group">
                  <label htmlFor="about-phone">Phone Number</label>

                  <input
                    id="about-phone"
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="about-form-group">
                <label htmlFor="about-email">Email Address</label>

                <input
                  id="about-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* =================================================
                  SERVICE
              ================================================= */}

              <div className="about-form-group">
                <label htmlFor="about-service">Service Required</label>

                <select
                  id="about-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                >
                  <option value="general-booking">General Booking</option>

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

              {/* =================================================
                  PROOF OF BOOKING / PAYMENT
              ================================================= */}

              <div className="about-form-group">
                <label htmlFor="about-proof">
                  Proof of Booking / Proof of Payment
                  <span className="about-form-optional"> Optional</span>
                </label>

                <input
                  id="about-proof"
                  type="file"
                  name="proofOfBooking"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                />

                {proofFile && <div className="about-selected-file">📎 {proofFile.name}</div>}
              </div>

              {/* =================================================
                  MESSAGE
              ================================================= */}

              <div className="about-form-group">
                <label htmlFor="about-message">Additional Information</label>

                <textarea
                  id="about-message"
                  name="message"
                  rows="4"
                  placeholder="Tell us anything else about your journey..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              {/* =================================================
                  STATUS
              ================================================= */}

              {status.success && <div className="about-booking-success">{status.success}</div>}

              {status.error && <div className="about-booking-error">{status.error}</div>}

              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button type="submit" className="about-booking-submit" disabled={status.loading}>
                <span>{status.loading ? 'Sending...' : 'Book Your Trip'}</span>

                <span className="about-booking-submit-arrow">↗</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
