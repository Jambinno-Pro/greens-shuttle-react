import "dotenv/config";

import express from "express";
import cors from "cors";

import quoteRoutes from "./routes/quoteRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// import { verifyEmailConnections } from "./services/emailService.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

// const PORT = process.env.PORT || 5000;

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://greensshuttle.co.za",
      "https://www.greensshuttle.co.za",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/uploads", express.static("uploads"));

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Greens Shuttle backend is running",
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/quotes", quoteRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/emails", authMiddleware, emailRoutes);

app.use("/api/reviews", reviewRoutes);

export default app;
