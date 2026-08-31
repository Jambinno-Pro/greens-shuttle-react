import jwt from "jsonwebtoken";

/* =========================================================
   VERIFY ADMIN JWT
========================================================= */

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    /* =====================================================
       CHECK AUTHORIZATION HEADER
    ===================================================== */

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /* =====================================================
       GET TOKEN
    ===================================================== */

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    /* =====================================================
       VERIFY TOKEN
    ===================================================== */

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* =====================================================
       STORE ADMIN USER ON REQUEST
    ===================================================== */

    req.admin = decoded;

    next();
  } catch (error) {
    console.error("JWT authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
}
