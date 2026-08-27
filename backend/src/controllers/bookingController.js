import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookingsFile = path.join(__dirname, "../../data/bookings.json");

export const createBooking = (req, res) => {
  try {
    const {
      pickup,
      destination,
      travelDate,
      travelTime,
      passengers,
      service,
      name,
      phone,
      email,
      message,
    } = req.body;

    // Validate required fields
    if (
      !pickup ||
      !destination ||
      !travelDate ||
      !travelTime ||
      !passengers ||
      !service ||
      !name ||
      !phone ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required booking fields.",
      });
    }

    // Make sure the data file exists
    if (!fs.existsSync(bookingsFile)) {
      fs.writeFileSync(bookingsFile, "[]");
    }

    const bookings = JSON.parse(fs.readFileSync(bookingsFile, "utf8"));

    const booking = {
      id: `BK-${Date.now()}`,
      type: "booking",

      // Customer
      name,
      email,
      phone,

      // Journey
      pickup,
      destination,
      travelDate,
      travelTime,
      passengers,
      service,

      // Additional information
      message: message || "",

      // Admin
      status: "pending",

      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);

    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    console.log("NEW BOOKING:", booking);

    return res.status(201).json({
      success: true,
      message: "Booking request received successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process booking request.",
    });
  }
};
