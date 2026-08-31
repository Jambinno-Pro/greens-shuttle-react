import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* =========================================================
   PATH SETUP
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "../../data");
const sentEmailsFile = path.join(dataDir, "sentEmails.json");
const uploadsDir = path.join(__dirname, "../../uploads");

/* =========================================================
   CREATE DIRECTORIES / FILE
========================================================= */

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(sentEmailsFile)) {
  fs.writeFileSync(sentEmailsFile, "[]", "utf8");
}

/* =========================================================
   READ SENT EMAILS
========================================================= */

const readSentEmails = () => {
  try {
    if (!fs.existsSync(sentEmailsFile)) {
      fs.writeFileSync(sentEmailsFile, "[]", "utf8");
      return [];
    }

    const file = fs.readFileSync(sentEmailsFile, "utf8");

    if (!file.trim()) {
      return [];
    }

    const emails = JSON.parse(file);

    return Array.isArray(emails) ? emails : [];
  } catch (error) {
    console.error("Read sent emails error:", error);
    return [];
  }
};

/* =========================================================
   WRITE SENT EMAILS
========================================================= */

const writeSentEmails = (emails) => {
  fs.writeFileSync(sentEmailsFile, JSON.stringify(emails, null, 2), "utf8");
};

/* =========================================================
   GET SENT EMAILS
========================================================= */

export const getSentEmails = () => {
  const emails = readSentEmails();

  return emails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/* =========================================================
   SAVE SENT EMAIL
========================================================= */

export const saveSentEmail = (email) => {
  const emails = readSentEmails();

  emails.unshift(email);

  writeSentEmails(emails);

  console.log(`✓ Sent email saved: ${email.id}`);

  return email;
};

/* =========================================================
   GET SENT EMAIL BY ID
========================================================= */

export const getSentEmailById = (id) => {
  const emails = readSentEmails();

  return emails.find((email) => String(email.id) === String(id)) || null;
};

/* =========================================================
   MARK SENT EMAIL AS READ
========================================================= */

export const markSentEmailAsRead = (id) => {
  const emails = readSentEmails();

  const email = emails.find((item) => String(item.id) === String(id));

  if (!email) {
    return null;
  }

  email.status = "read";

  writeSentEmails(emails);

  return email;
};

/* =========================================================
   DELETE SENT EMAIL
========================================================= */

export const deleteSentEmail = (id) => {
  const emails = readSentEmails();

  const emailIndex = emails.findIndex((item) => String(item.id) === String(id));

  if (emailIndex === -1) {
    return false;
  }

  const deletedEmail = emails[emailIndex];

  /* =====================================================
     DELETE ATTACHMENTS
  ===================================================== */

  if (Array.isArray(deletedEmail.attachments)) {
    deletedEmail.attachments.forEach((attachment) => {
      if (!attachment.filename) {
        return;
      }

      const filePath = path.join(uploadsDir, attachment.filename);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);

          console.log(`✓ Deleted attachment: ${attachment.filename}`);
        } catch (error) {
          console.error("Attachment delete error:", error);
        }
      }
    });
  }

  /* =====================================================
     REMOVE EMAIL
  ===================================================== */

  emails.splice(emailIndex, 1);

  writeSentEmails(emails);

  console.log(`✓ Deleted sent email: ${deletedEmail.id}`);

  return true;
};

/* =========================================================
   CREATE RECEIVED EMAIL
========================================================= */

export const createReceivedEmail = async ({
  name = "",
  email = "",
  subject = "",
  message = "",
  attachments = [],
}) => {
  return {
    id: `RE-${Date.now()}`,

    type: "received",

    status: "unread",

    name,

    email,

    subject,

    message,

    attachments,

    createdAt: new Date().toISOString(),
  };
};

/* =========================================================
   LEGACY CONTROLLER FUNCTIONS
========================================================= */

export const getAllEmails = async (req, res) => {
  try {
    const emails = getSentEmails();

    return res.json({
      success: true,
      emails,
    });
  } catch (error) {
    console.error("Get all emails error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load emails.",
    });
  }
};

export const getInboxEmails = async (req, res) => {
  try {
    return res.json({
      success: true,
      emails: [],
    });
  } catch (error) {
    console.error("Get inbox error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load inbox emails.",
    });
  }
};

export const getEmailById = async (req, res) => {
  try {
    const email = getSentEmailById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found.",
      });
    }

    return res.json({
      success: true,
      email,
    });
  } catch (error) {
    console.error("Get email error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load email.",
    });
  }
};

export const markEmailAsRead = async (req, res) => {
  try {
    const email = markSentEmailAsRead(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found.",
      });
    }

    return res.json({
      success: true,
      message: "Email marked as read.",
      email,
    });
  } catch (error) {
    console.error("Mark email read error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to mark email as read.",
    });
  }
};
