import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { sendEmail, fetchInboxEmails } from "../services/emailService.js";

import {
  getSentEmails,
  saveSentEmail,
  markSentEmailAsRead,
  getSentEmailById,
  deleteSentEmail,
} from "../controllers/emailController.js";

const router = express.Router();

/* =========================================================
   PATH SETUP
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../../uploads");

/* =========================================================
   CREATE UPLOAD DIRECTORY
========================================================= */

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true,
  });
}

/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");

    cb(null, `${Date.now()}-${safeName}`);
  },
});

/* =========================================================
   MULTER
========================================================= */

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/* =========================================================
   GET ALL EMAILS
========================================================= */

router.get("/", async (req, res) => {
  try {
    const mailbox = req.query.mailbox || "info";

    const inboxEmails = await fetchInboxEmails({
      mailbox,
      limit: 50,
    });

    const sentEmails = getSentEmails();

    const allEmails = [...sentEmails, ...inboxEmails].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    return res.json({
      success: true,
      emails: allEmails,
    });
  } catch (error) {
    console.error("Get all emails error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to load emails.",
    });
  }
});

/* =========================================================
   GET INBOX
========================================================= */

router.get("/inbox", async (req, res) => {
  try {
    const mailbox = req.query.mailbox || "info";

    if (!["info", "bookings"].includes(mailbox)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mailbox. Use info or bookings.",
      });
    }

    console.log(`📥 Loading inbox: ${mailbox}@greensshuttle.co.za`);

    const inboxEmails = await fetchInboxEmails({
      mailbox,
      limit: 50,
    });

    return res.json({
      success: true,
      mailbox,
      emails: inboxEmails,
    });
  } catch (error) {
    console.error("Get inbox error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to load inbox emails.",
    });
  }
});

/* =========================================================
   GET SENT EMAILS
========================================================= */

router.get("/sent", (req, res) => {
  try {
    const emails = getSentEmails();

    return res.json({
      success: true,
      emails,
    });
  } catch (error) {
    console.error("Get sent emails error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load sent emails.",
    });
  }
});

/* =========================================================
   SEND EMAIL
========================================================= */

router.post("/send", upload.array("attachments"), async (req, res) => {
  try {
    const {
      email,
      name,
      subject,
      message,
      from = "info@greensshuttle.co.za",
    } = req.body;

    /* =====================================================
         VALIDATION
      ===================================================== */

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Recipient email is required.",
      });
    }

    if (!subject?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email subject is required.",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email message is required.",
      });
    }

    /* =====================================================
         SELECT SENDER
      ===================================================== */

    let sender;

    if (from.trim() === "info@greensshuttle.co.za") {
      sender = "info";
    } else if (from.trim() === "bookings@greensshuttle.co.za") {
      sender = "bookings";
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid sending email address.",
      });
    }

    /* =====================================================
         ATTACHMENTS
      ===================================================== */

    const attachments = (req.files || []).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,

      name: file.originalname,

      filename: file.filename,

      filePath: file.path,

      path: `/uploads/${file.filename}`,

      mimetype: file.mimetype,

      size: file.size,
    }));

    /* =====================================================
         SEND REAL EMAIL
      ===================================================== */

    const sentResult = await sendEmail({
      from: sender,

      to: email.trim(),

      subject: subject.trim(),

      message: message.trim(),

      attachments,
    });

    /* =====================================================
         CREATE SENT RECORD
      ===================================================== */

    const newEmail = {
      id: `SE-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

      type: "sent",

      status: "sent",

      name: name?.trim() || "",

      email: email.trim(),

      subject: subject.trim(),

      message: message.trim(),

      attachments,

      from: sentResult.from || from.trim(),

      messageId: sentResult.messageId || "",

      createdAt: new Date().toISOString(),
    };

    /* =====================================================
         SAVE AFTER SUCCESSFUL SMTP SEND
      ===================================================== */

    saveSentEmail(newEmail);

    console.log(`✓ Email sent and saved: ${newEmail.id}`);

    return res.status(201).json({
      success: true,

      message: "Email sent successfully.",

      email: newEmail,
    });
  } catch (error) {
    console.error("Send email error:", error);

    return res.status(500).json({
      success: false,

      message: error?.message || "Unable to send email. Please try again.",
    });
  }
});

/* =========================================================
   MARK EMAIL AS READ
========================================================= */

router.patch("/:id/read", async (req, res) => {
  try {
    const updatedEmail = markSentEmailAsRead(req.params.id);

    if (updatedEmail) {
      return res.json({
        success: true,
        message: "Email marked as read.",
        email: updatedEmail,
      });
    }

    return res.json({
      success: true,
      message: "Email opened.",
    });
  } catch (error) {
    console.error("Mark email as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to mark email as read.",
    });
  }
});

/* =========================================================
   GET SINGLE EMAIL
========================================================= */

router.get("/:id", async (req, res) => {
  try {
    const sentEmail = getSentEmailById(req.params.id);

    if (sentEmail) {
      return res.json({
        success: true,
        email: sentEmail,
      });
    }

    /* =====================================================
       SEARCH REAL MAILBOXES
    ===================================================== */

    for (const mailbox of ["info", "bookings"]) {
      const inboxEmails = await fetchInboxEmails({
        mailbox,
        limit: 50,
      });

      const foundEmail = inboxEmails.find(
        (item) => String(item.id) === String(req.params.id),
      );

      if (foundEmail) {
        return res.json({
          success: true,
          email: foundEmail,
        });
      }
    }

    return res.status(404).json({
      success: false,
      message: "Email not found.",
    });
  } catch (error) {
    console.error("Get single email error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load email.",
    });
  }
});

/* =========================================================
   DELETE SENT EMAIL
========================================================= */

router.delete("/:id", (req, res) => {
  try {
    const deleted = deleteSentEmail(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Email not found.",
      });
    }

    return res.json({
      success: true,
      message: "Sent email deleted successfully.",
    });
  } catch (error) {
    console.error("Delete sent email error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete sent email.",
    });
  }
});

/* =========================================================
   MULTER / ROUTE ERROR HANDLER
========================================================= */

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    console.error("Email route error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to process email request.",
    });
  }

  next();
});

/* =========================================================
   EXPORT
========================================================= */

export default router;
