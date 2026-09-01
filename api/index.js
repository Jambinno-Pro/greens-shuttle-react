import "dotenv/config";
import express from "express";
import cors from "cors";

import quoteRoutes from "../backend/src/routes/quoteRoutes.js";
import bookingRoutes from "../backend/src/routes/bookingRoutes.js";
import contactRoutes from "../backend/src/routes/contactRoutes.js";
import emailRoutes from "../backend/src/routes/emailRoutes.js";
import reviewRoutes from "../backend/src/routes/reviewRoutes.js";
import authRoutes from "../backend/src/routes/authRoutes.js";
import authMiddleware from "../backend/src/middleware/authMiddleware.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Greens Shuttle backend is running on Vercel",
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

/* =========================================================
   EXPORT FOR VERCEL
========================================================= */

export default app;
