import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

/* =========================================================
   PATH SETUP
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../../uploads/bookings");

/* =========================================================
   CREATE UPLOAD DIRECTORY
========================================================= */

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true,
  });
}

/* =========================================================
   FILE STORAGE
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");

    const uniqueName = `${Date.now()}-${safeName}`;

    cb(null, uniqueName);
  },
});

/* =========================================================
   ALLOWED FILE TYPES
========================================================= */

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   FILE FILTER
========================================================= */

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Please upload PDF, JPG, JPEG, PNG or WEBP.",
      ),
      false,
    );
  }

  cb(null, true);
};

/* =========================================================
   MULTER
========================================================= */

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/* =========================================================
   CREATE BOOKING
========================================================= */

router.post("/", upload.single("proofOfBooking"), createBooking);

/* =========================================================
   GET ALL BOOKINGS
========================================================= */

router.get("/", getBookings);

/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

router.patch("/:id/status", updateBookingStatus);

/* =========================================================
   DELETE BOOKING
========================================================= */

router.delete("/:id", deleteBooking);

/* =========================================================
   UPLOAD ERROR HANDLER
========================================================= */

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    console.error("Booking route error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to process booking request.",
    });
  }

  next();
});

export default router;
