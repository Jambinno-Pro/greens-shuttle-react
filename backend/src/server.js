import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import quoteRoutes from "./routes/quoteRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: "http://localhost:5173",
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

app.use("/api/quotes", quoteRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/contact", contactRoutes);

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log(`Greens Shuttle backend running on port ${PORT}`);
});
