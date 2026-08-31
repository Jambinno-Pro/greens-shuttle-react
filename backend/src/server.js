import "dotenv/config";

import express from "express";
import cors from "cors";

import quoteRoutes from "./routes/quoteRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { verifyEmailConnections } from "./services/emailService.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

const PORT = process.env.PORT || 5000;

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

app.get("/api/email-network-test", async (req, res) => {
  const net = await import("net");

  const host = process.env.MAIL_HOST;
  const port = Number(process.env.MAIL_SMTP_PORT) || 465;

  const socket = new net.Socket();

  socket.setTimeout(10000);

  socket.on("connect", () => {
    socket.destroy();

    res.json({
      success: true,
      host,
      port,
      message: "Render can reach the SMTP server.",
    });
  });

  socket.on("timeout", () => {
    socket.destroy();

    res.status(504).json({
      success: false,
      host,
      port,
      message: "Connection timed out.",
    });
  });

  socket.on("error", (error) => {
    socket.destroy();

    res.status(500).json({
      success: false,
      host,
      port,
      message: error.message,
    });
  });

  socket.connect(port, host);
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
   START SERVER
========================================================= */

app.listen(PORT, "0.0.0.0", async () => {
  console.log("");
  console.log("==========================================");
  console.log("   GREENS SHUTTLE BACKEND");
  console.log("==========================================");
  console.log(`Server running on port ${PORT}`);
  console.log("==========================================");
  console.log("");

  /* =======================================================
     TEST EMAIL CONNECTIONS
  ======================================================== */

  try {
    await verifyEmailConnections();
  } catch (error) {
    console.error("Email connection verification failed:");
    console.error(error.message);
  }
});
