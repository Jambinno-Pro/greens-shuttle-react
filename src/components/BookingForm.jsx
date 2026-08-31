import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    date: '',
    passengers: '',
    service: '',
  });

  const [proofFile, setProofFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  /* =====================================================
     FORM CHANGE
  ====================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     FILE CHANGE
  ====================================================== */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setProofFile(null);
      return;
    }

    setProofFile(file);
  };

  /* =====================================================
     SUBMIT BOOKING
  ====================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatusMessage('');
    setStatusType('');

    try {
      setSending(true);

      /* =================================================
         FORM DATA
      ================================================= */

      const bookingData = new FormData();

      bookingData.append('pickup', formData.pickup);
      bookingData.append('destination', formData.destination);
      bookingData.append('travelDate', formData.date);
      bookingData.append('passengers', formData.passengers);
      bookingData.append('service', formData.service);

      /* =================================================
         PROOF OF BOOKING / DOCUMENT
      ================================================= */

      if (proofFile) {
        bookingData.append('proofOfBooking', proofFile);
      }

      /* =================================================
         SEND TO BACKEND
      ================================================= */

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        body: bookingData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit booking request.');
      }

      /* =================================================
         SUCCESS
      ================================================= */

      console.log('Booking created:', data);

      setStatusMessage(
        'Thank you! Your booking request has been received. We will contact you shortly.'
      );

      setStatusType('success');

      /* =================================================
         RESET FORM
      ================================================= */

      setFormData({
        pickup: '',
        destination: '',
        date: '',
        passengers: '',
        service: '',
      });

      setProofFile(null);

      /* Reset file input */
      const fileInput = document.getElementById('proofOfBooking');

      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Booking submission error:', error);

      setStatusMessage(error.message || 'Unable to submit booking. Please try again.');

      setStatusType('error');
    } finally {
      setSending(false);
    }
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
            STATUS MESSAGE
        ====================================================== */}

        {statusMessage && (
          <div className={`booking-form-status ${statusType}`}>{statusMessage}</div>
        )}

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

          {/* =====================================================
              PROOF OF BOOKING / DOCUMENT
          ====================================================== */}

          <div className="glass-field">
            <label htmlFor="proofOfBooking">Proof of Payment / Document</label>

            <input
              id="proofOfBooking"
              name="proofOfBooking"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
            />

            {proofFile && <small>Selected: {proofFile.name}</small>}

            <small>PDF, JPG, JPEG, PNG or WEBP — maximum 10 MB.</small>
          </div>

          {/* =====================================================
              SUBMIT
          ====================================================== */}

          <button type="submit" className="glass-booking-button" disabled={sending}>
            {sending ? (
              <>
                <span>Sending...</span>
                <span>⏳</span>
              </>
            ) : (
              <>
                <span>Request a Booking</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
