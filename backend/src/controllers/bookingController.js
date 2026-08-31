import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookingsFile = path.join(__dirname, "../../data/bookings.json");

/* =========================================================
   CREATE BOOKING
========================================================= */

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
    } = req.body || {};

    /* =====================================================
       DEBUG
    ===================================================== */

    console.log("BOOKING BODY:", req.body);

    console.log(
      "BOOKING FILE:",
      req.file
        ? {
            originalname: req.file.originalname,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
          }
        : "No proof uploaded",
    );

    /* =====================================================
       VALIDATE REQUIRED FIELDS
    ===================================================== */

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

    /* =====================================================
       MAKE SURE DATA DIRECTORY EXISTS
    ===================================================== */

    const dataDirectory = path.dirname(bookingsFile);

    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, {
        recursive: true,
      });
    }

    /* =====================================================
       MAKE SURE BOOKINGS FILE EXISTS
    ===================================================== */

    if (!fs.existsSync(bookingsFile)) {
      fs.writeFileSync(bookingsFile, "[]");
    }

    /* =====================================================
       READ EXISTING BOOKINGS
    ===================================================== */

    let bookings = [];

    try {
      const fileContents = fs.readFileSync(bookingsFile, "utf8");

      bookings = fileContents ? JSON.parse(fileContents) : [];

      if (!Array.isArray(bookings)) {
        bookings = [];
      }
    } catch (error) {
      console.error("Unable to read bookings.json:", error);

      bookings = [];
    }

    /* =====================================================
   GENERATE PROFESSIONAL BOOKING ID

   IMPORTANT:
   Only IDs using the new 6-digit format are counted.

   Old IDs such as:
   BK-1788124050360

   are completely ignored.
===================================================== */

    let highestBookingNumber = 0;

    bookings.forEach((booking) => {
      if (!booking?.id) return;

      const id = String(booking.id).trim();

      /*
    Only accept the new format:

    BK-000001
    BK-000002
    BK-000127

    Old timestamp IDs will NOT match this pattern.
  */
      const match = id.match(/^BK-(\d{6})$/);

      if (!match) return;

      const number = Number(match[1]);

      if (Number.isInteger(number) && number > highestBookingNumber) {
        highestBookingNumber = number;
      }
    });

    /*
  Start at BK-000001 if no professional
  booking IDs exist yet.
*/
    const nextBookingNumber = highestBookingNumber + 1;

    const bookingId = `BK-${String(nextBookingNumber).padStart(6, "0")}`;

    console.log("NEW BOOKING ID:", bookingId);
    /* =====================================================
       PROOF FILE INFORMATION
    ===================================================== */

    let proofOfBooking = null;

    if (req.file) {
      proofOfBooking = {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      };
    }

    /* =====================================================
       CREATE BOOKING
    ===================================================== */

    const booking = {
      id: bookingId,

      type: "booking",

      /* Customer */

      name,
      email,
      phone,

      /* Journey */

      pickup,
      destination,
      travelDate,
      travelTime,
      passengers,
      service,

      /* Additional information */

      message: message || "",

      /* Proof */

      proofOfBooking,

      /* Admin */

      status: "pending",

      createdAt: new Date().toISOString(),
    };

    /* =====================================================
       SAVE BOOKING
    ===================================================== */

    bookings.push(booking);

    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    /* =====================================================
       LOG
    ===================================================== */

    console.log("NEW BOOKING:", booking);

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(201).json({
      success: true,
      message: "Booking request received successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to process booking request.",
    });
  }
};

/* =========================================================
   GET ALL BOOKINGS
========================================================= */

export const getBookings = (req, res) => {
  try {
    const dataDirectory = path.dirname(bookingsFile);

    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, {
        recursive: true,
      });
    }

    if (!fs.existsSync(bookingsFile)) {
      fs.writeFileSync(bookingsFile, "[]");
    }

    const fileContents = fs.readFileSync(bookingsFile, "utf8");

    const bookings = fileContents ? JSON.parse(fileContents) : [];

    return res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load bookings.",
    });
  }
};

/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

export const updateBookingStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    /* =====================================================
       ALLOWED STATUSES
    ===================================================== */

    const allowedStatuses = ["pending", "in-progress", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    /* =====================================================
       MAKE SURE BOOKINGS FILE EXISTS
    ===================================================== */

    if (!fs.existsSync(bookingsFile)) {
      return res.status(404).json({
        success: false,
        message: "Bookings file not found.",
      });
    }

    /* =====================================================
       READ BOOKINGS
    ===================================================== */

    const fileContents = fs.readFileSync(bookingsFile, "utf8");

    const bookings = fileContents ? JSON.parse(fileContents) : [];

    /* =====================================================
       FIND BOOKING
    ===================================================== */

    const bookingIndex = bookings.findIndex(
      (booking) => String(booking.id) === String(id),
    );

    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    /* =====================================================
       UPDATE STATUS
    ===================================================== */

    bookings[bookingIndex].status = status;

    /* =====================================================
       SAVE
    ===================================================== */

    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    console.log(`BOOKING STATUS UPDATED: ${id} → ${status}`);

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.json({
      success: true,
      message: "Booking status updated successfully.",
      booking: bookings[bookingIndex],
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update booking status.",
    });
  }
};

/* =========================================================
   DELETE BOOKING
========================================================= */

export const deleteBooking = (req, res) => {
  try {
    const { id } = req.params;

    /* =====================================================
       MAKE SURE BOOKINGS FILE EXISTS
    ===================================================== */

    if (!fs.existsSync(bookingsFile)) {
      return res.status(404).json({
        success: false,
        message: "Bookings file not found.",
      });
    }

    /* =====================================================
       READ BOOKINGS
    ===================================================== */

    const fileContents = fs.readFileSync(bookingsFile, "utf8");

    const bookings = fileContents ? JSON.parse(fileContents) : [];

    /* =====================================================
       FIND BOOKING
    ===================================================== */

    const bookingIndex = bookings.findIndex(
      (booking) => String(booking.id) === String(id),
    );

    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    /* =====================================================
       REMOVE BOOKING
    ===================================================== */

    const deletedBooking = bookings[bookingIndex];

    bookings.splice(bookingIndex, 1);

    /* =====================================================
       SAVE UPDATED BOOKINGS
    ===================================================== */

    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    console.log(`BOOKING DELETED: ${deletedBooking.id}`);

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.json({
      success: true,
      message: "Booking deleted successfully.",
      booking: deletedBooking,
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete booking.",
    });
  }
};
