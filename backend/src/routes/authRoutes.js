import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

/* =========================================================
   ADMIN LOGIN
   POST /api/auth/login
========================================================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    /* =====================================================
       ADMIN CREDENTIALS
       Loaded from backend/.env
    ===================================================== */

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("❌ Admin credentials are not configured.");

      return res.status(500).json({
        success: false,
        message: "Admin login is not configured on the server.",
      });
    }

    /* =====================================================
       CHECK EMAIL
    ===================================================== */

    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /* =====================================================
       CHECK PASSWORD
    ===================================================== */

    if (password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /* =====================================================
       JWT SECRET
    ===================================================== */

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("❌ JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Authentication is not configured on the server.",
      });
    }

    /* =====================================================
       CREATE ADMIN TOKEN
    ===================================================== */

    const token = jwt.sign(
      {
        role: "admin",
        email: adminEmail,
      },
      jwtSecret,
      {
        expiresIn: "8h",
      },
    );

    /* =====================================================
       ADMIN USER
    ===================================================== */

    const user = {
      email: adminEmail,
      role: "admin",
      name: "Greens Shuttle Admin",
    };

    /* =====================================================
       SUCCESS
    ===================================================== */

    console.log(`✓ Admin login successful: ${adminEmail}`);

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login. Please try again.",
    });
  }
});

/* =========================================================
   EXPORT
========================================================= */

export default router;
