import { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    date: '',
    passengers: '',
    service: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Booking request:', formData);

    alert('Thank you! Your booking request has been received. We will contact you shortly.');
  };

  return (
    <section className="booking-banner">
      <div className="booking-glass-card">
        {/* =====================================================
            HEADING
        ====================================================== */}
        <div className="booking-glass-heading">
          <span className="section-eyebrow">PLAN YOUR JOURNEY</span>

          <h2>
            Let&apos;s get you
            <span> where you need to go.</span>
          </h2>

          <p>
            Tell us where you&apos;re going and we&apos;ll take care of the journey. Complete the
            form below and our team will get back to you shortly.
          </p>
        </div>

        {/* =====================================================
            BOOKING FORM
        ====================================================== */}
        <form className="glass-booking-form" onSubmit={handleSubmit}>
          {/* PICKUP */}
          <div className="glass-field">
            <label htmlFor="pickup">Pickup Location</label>

            <input
              id="pickup"
              name="pickup"
              type="text"
              placeholder="Where are you leaving from?"
              value={formData.pickup}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESTINATION */}
          <div className="glass-field">
            <label htmlFor="destination">Destination</label>

            <input
              id="destination"
              name="destination"
              type="text"
              placeholder="Where are you going?"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>

          {/* DATE */}
          <div className="glass-field">
            <label htmlFor="date">Travel Date</label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSENGERS */}
          <div className="glass-field">
            <label htmlFor="passengers">Passengers</label>

            <input
              id="passengers"
              name="passengers"
              type="number"
              min="1"
              placeholder="e.g. 4"
              value={formData.passengers}
              onChange={handleChange}
              required
            />
          </div>

          {/* SERVICE */}
          <div className="glass-field">
            <label htmlFor="service">Service</label>

            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Select service</option>

              <option value="airport-transfer">Airport Transfer</option>

              <option value="wine-tour">Wine Tour</option>

              <option value="garden-route">Garden Route</option>

              <option value="game-drive">Game Drive</option>

              <option value="chauffeur-services">Chauffeur Services</option>

              <option value="events-transfer">Events Transfer</option>

              <option value="private-tour">Private Tour</option>

              <option value="other">Other</option>
            </select>
          </div>

          {/* SUBMIT */}
          <button type="submit" className="glass-booking-button">
            <span>Request a Booking</span>

            <span>→</span>
          </button>
        </form>
      </div>
    </section>
  );
}
