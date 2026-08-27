import express from "express";
import multer from "multer";

import {
  createBooking,
  getBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

/* =========================================================
   FILE UPLOAD CONFIGURATION
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/bookings");
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;

    cb(null, uniqueName);
  },
});

/* =========================================================
   ALLOWED FILE TYPES
========================================================= */

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Please upload PDF, JPG, JPEG, PNG or WEBP.",
      ),
      false,
    );
  }
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

export default router;
