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
    /*
      Because multer is processing the request,
      normal form fields are available through req.body
      and the uploaded proof is available through req.file.
    */

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
    } catch (error) {
      console.error("Unable to read bookings.json:", error);

      bookings = [];
    }

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
      id: `BK-${Date.now()}`,

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
       READ BOOKINGS
    ===================================================== */

    const fileContents = fs.readFileSync(bookingsFile, "utf8");

    const bookings = fileContents ? JSON.parse(fileContents) : [];

    /* =====================================================
       RESPONSE
    ===================================================== */

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
