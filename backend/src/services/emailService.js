import "dotenv/config";
import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* =========================================================
   PATH SETUP
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/* =========================================================
   ENVIRONMENT VARIABLES
========================================================= */

const {
  INFO_EMAIL,
  INFO_EMAIL_PASSWORD,

  BOOKINGS_EMAIL,
  BOOKINGS_EMAIL_PASSWORD,

  MAIL_HOST,
  MAIL_IMAP_PORT,
  MAIL_SMTP_PORT,
} = process.env;

/* =========================================================
   CONFIGURATION CHECK
========================================================= */

console.log("==========================================");
console.log("EMAIL SERVICE CONFIGURATION");
console.log("==========================================");
console.log("MAIL HOST:", MAIL_HOST);
console.log("SMTP PORT:", MAIL_SMTP_PORT);
console.log("IMAP PORT:", MAIL_IMAP_PORT);
console.log("INFO EMAIL:", INFO_EMAIL);
console.log("INFO PASSWORD:", INFO_EMAIL_PASSWORD ? "LOADED" : "MISSING");
console.log("BOOKINGS EMAIL:", BOOKINGS_EMAIL);
console.log(
  "BOOKINGS PASSWORD:",
  BOOKINGS_EMAIL_PASSWORD ? "LOADED" : "MISSING",
);
console.log("==========================================");

/* =========================================================
   SMTP TRANSPORTER
========================================================= */

const createTransporter = (email, password) => {
  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_SMTP_PORT) || 465,
    secure: true,

    auth: {
      user: email,
      pass: password,
    },

    tls: {
      rejectUnauthorized: false,
    },

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
  });
};

/* =========================================================
   SMTP MAILBOXES
========================================================= */

const infoTransporter = createTransporter(INFO_EMAIL, INFO_EMAIL_PASSWORD);

const bookingsTransporter = createTransporter(
  BOOKINGS_EMAIL,
  BOOKINGS_EMAIL_PASSWORD,
);

/* =========================================================
   VERIFY SMTP CONNECTIONS
========================================================= */

export const verifyEmailConnections = async () => {
  console.log("==========================================");
  console.log("VERIFYING SMTP CONNECTIONS");
  console.log("==========================================");

  try {
    await infoTransporter.verify();

    console.log(`✓ SMTP connection successful: ${INFO_EMAIL}`);
  } catch (error) {
    console.error(`✗ SMTP connection failed: ${INFO_EMAIL}`);
    console.error(error.message);
  }

  try {
    await bookingsTransporter.verify();

    console.log(`✓ SMTP connection successful: ${BOOKINGS_EMAIL}`);
  } catch (error) {
    console.error(`✗ SMTP connection failed: ${BOOKINGS_EMAIL}`);

    console.error(error.message);
  }

  console.log("==========================================");
};

/* =========================================================
   SEND EMAIL
========================================================= */

export const sendEmail = async ({
  from = "info",
  to,
  subject,
  message,
  attachments = [],
}) => {
  if (!to || !to.trim()) {
    throw new Error("Recipient email is required.");
  }

  if (!subject || !subject.trim()) {
    throw new Error("Email subject is required.");
  }

  if (!message || !message.trim()) {
    throw new Error("Email message is required.");
  }

  let transporter;
  let senderEmail;

  if (from === "bookings") {
    transporter = bookingsTransporter;
    senderEmail = BOOKINGS_EMAIL;
  } else {
    transporter = infoTransporter;
    senderEmail = INFO_EMAIL;
  }

  if (!senderEmail) {
    throw new Error("Sender email is not configured.");
  }

  /* =======================================================
     ATTACHMENTS
  ======================================================= */

  const mailAttachments = [];

  for (const attachment of attachments) {
    const attachmentPath =
      attachment.filePath || attachment.absolutePath || attachment.path;

    if (!attachmentPath) {
      console.warn("Attachment skipped - no file path:", attachment);

      continue;
    }

    if (!fs.existsSync(attachmentPath)) {
      console.error("Attachment does not exist:", attachmentPath);

      throw new Error(`Attachment file not found: ${attachmentPath}`);
    }

    mailAttachments.push({
      filename: attachment.name || attachment.filename || "attachment",

      path: attachmentPath,

      contentType: attachment.mimetype || "application/octet-stream",
    });
  }

  /* =======================================================
     MAIL OPTIONS
  ======================================================= */

  const mailOptions = {
    from: `"Greens Shuttle" <${senderEmail}>`,

    to: to.trim(),

    subject: subject.trim(),

    text: message.trim(),

    attachments: mailAttachments,
  };

  /* =======================================================
     SEND LOG
  ======================================================= */

  console.log("==========================================");
  console.log("SENDING EMAIL");
  console.log("==========================================");

  console.log("FROM:", senderEmail);
  console.log("TO:", to.trim());
  console.log("SUBJECT:", subject.trim());
  console.log("ATTACHMENTS:", mailAttachments.length);

  /* =======================================================
     SEND
  ======================================================= */

  const result = await transporter.sendMail(mailOptions);

  console.log("==========================================");
  console.log("✓ EMAIL ACCEPTED BY SMTP SERVER");
  console.log("==========================================");

  console.log("Message ID:", result.messageId);
  console.log("Accepted:", result.accepted);
  console.log("Rejected:", result.rejected);
  console.log("Response:", result.response);

  console.log("==========================================");

  return {
    success: true,

    messageId: result.messageId,

    from: senderEmail,

    to: to.trim(),

    subject: subject.trim(),

    accepted: result.accepted || [],

    rejected: result.rejected || [],

    response: result.response,
  };
};

/* =========================================================
   CREATE IMAP CLIENT
========================================================= */

const createImapClient = (email, password) => {
  return new ImapFlow({
    host: MAIL_HOST,

    port: Number(MAIL_IMAP_PORT) || 993,

    secure: true,

    auth: {
      user: email,
      pass: password,
    },

    logger: false,

    tls: {
      rejectUnauthorized: false,
    },

    connectionTimeout: 15000,

    greetingTimeout: 15000,

    socketTimeout: 30000,
  });
};

/* =========================================================
   FETCH INBOX EMAILS
========================================================= */

export const fetchInboxEmails = async ({
  mailbox = "info",
  limit = 50,
} = {}) => {
  const isBookings = mailbox === "bookings";

  const email = isBookings ? BOOKINGS_EMAIL : INFO_EMAIL;

  const password = isBookings ? BOOKINGS_EMAIL_PASSWORD : INFO_EMAIL_PASSWORD;

  console.log("");
  console.log("==========================================");
  console.log("📥 IMAP INBOX FETCH");
  console.log("==========================================");
  console.log("Mailbox:", mailbox);
  console.log("Email:", email);
  console.log("Host:", MAIL_HOST);
  console.log("Port:", MAIL_IMAP_PORT);
  console.log("==========================================");

  if (!email || !password) {
    throw new Error(`${mailbox} mailbox credentials are not configured.`);
  }

  const client = createImapClient(email, password);

  const receivedEmails = [];

  try {
    /* =====================================================
       CONNECT
    ===================================================== */

    await client.connect();

    console.log(`✓ IMAP connected: ${email}`);

    /* =====================================================
       LIST MAILBOXES
    ===================================================== */

    console.log("");
    console.log("------------------------------------------");
    console.log("AVAILABLE MAILBOXES");
    console.log("------------------------------------------");

    try {
      const mailboxes = await client.list();

      for (const box of mailboxes) {
        console.log(
          `• ${box.path}`,
          box.specialUse ? `(specialUse: ${box.specialUse})` : "",
        );
      }
    } catch (error) {
      console.warn("Unable to list mailboxes:", error.message);
    }

    /* =====================================================
       OPEN INBOX
    ===================================================== */

    const lock = await client.getMailboxLock("INBOX");

    try {
      const mailboxInfo = client.mailbox;

      const totalMessages = mailboxInfo?.exists || 0;

      console.log("");
      console.log("------------------------------------------");
      console.log("INBOX STATUS");
      console.log("------------------------------------------");
      console.log("Mailbox:", mailboxInfo?.path);
      console.log("Total messages:", totalMessages);

      if (totalMessages === 0) {
        console.log(`⚠ No emails found in ${email} INBOX.`);

        console.log("This means the IMAP server reports an empty INBOX.");

        console.log("------------------------------------------");

        return [];
      }

      const start = Math.max(1, totalMessages - limit + 1);

      console.log("Fetching messages:", `${start}:${totalMessages}`);

      console.log("------------------------------------------");

      /* ===================================================
         FETCH MESSAGES
      =================================================== */

      for await (const message of client.fetch(`${start}:${totalMessages}`, {
        uid: true,

        envelope: true,

        source: true,

        flags: true,

        internalDate: true,
      })) {
        try {
          if (!message.source) {
            continue;
          }

          const parsed = await simpleParser(message.source);

          /* ===============================================
             SENDER
          =============================================== */

          const sender = parsed.from?.value?.[0];

          /* ===============================================
             ATTACHMENTS
          =============================================== */

          const attachments = [];

          for (const attachment of parsed.attachments || []) {
            const safeName = attachment.filename
              ? attachment.filename.replace(/[^a-zA-Z0-9.-]/g, "_")
              : `attachment-${Date.now()}`;

            const filename = `${Date.now()}-${safeName}`;

            const filePath = path.join(uploadsDir, filename);

            fs.writeFileSync(filePath, attachment.content);

            attachments.push({
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,

              name: attachment.filename || "Attachment",

              filename,

              filePath,

              path: `/uploads/${filename}`,

              mimetype: attachment.contentType || "application/octet-stream",

              size: attachment.size || 0,
            });
          }

          /* ===============================================
             DATE
          =============================================== */

          const messageDate = message.internalDate || parsed.date || new Date();

          /* ===============================================
             EMAIL OBJECT
          =============================================== */

          const emailObject = {
            id: String(message.uid),

            type: "received",

            status: message.flags?.has("\\Seen") ? "read" : "unread",

            name: sender?.name || "",

            email: sender?.address || "",

            subject: parsed.subject || "No subject",

            message: parsed.text || parsed.html || "No message content.",

            attachments,

            createdAt: messageDate.toISOString(),

            mailbox,

            uid: message.uid,
          };

          receivedEmails.push(emailObject);

          console.log(`✓ ${emailObject.subject}`);

          console.log(`  From: ${emailObject.email}`);
        } catch (error) {
          console.error("Error parsing email:", error.message);
        }
      }

      console.log("------------------------------------------");
      console.log("Fetched emails:", receivedEmails.length);
      console.log("------------------------------------------");
    } finally {
      lock.release();
    }

    return receivedEmails;
  } catch (error) {
    console.error("");
    console.error("==========================================");
    console.error("✗ IMAP FETCH ERROR");
    console.error("==========================================");
    console.error("Mailbox:", mailbox);
    console.error("Email:", email);
    console.error("Error:", error.message);
    console.error("==========================================");

    throw error;
  } finally {
    await client.logout().catch(() => {});
  }
};

/* =========================================================
   TEST SPECIFIC MAILBOX
========================================================= */

export const testMailboxConnection = async (mailbox = "info") => {
  const isBookings = mailbox === "bookings";

  const email = isBookings ? BOOKINGS_EMAIL : INFO_EMAIL;

  const password = isBookings ? BOOKINGS_EMAIL_PASSWORD : INFO_EMAIL_PASSWORD;

  console.log("");
  console.log("==========================================");
  console.log("📧 TESTING MAILBOX");
  console.log("==========================================");
  console.log("Mailbox:", mailbox);
  console.log("Email:", email);
  console.log("==========================================");

  const client = createImapClient(email, password);

  try {
    await client.connect();

    console.log(`✓ Connected successfully: ${email}`);

    const mailboxes = await client.list();

    console.log("");
    console.log("MAILBOXES:");

    for (const box of mailboxes) {
      console.log(`• ${box.path}`, box.specialUse ? `(${box.specialUse})` : "");
    }

    const lock = await client.getMailboxLock("INBOX");

    try {
      console.log("");
      console.log("INBOX:");

      console.log("Messages:", client.mailbox?.exists || 0);

      console.log("Unread:", client.mailbox?.unseen || 0);
    } finally {
      lock.release();
    }

    return true;
  } finally {
    await client.logout().catch(() => {});
  }
};

/* =========================================================
   EXPORT TRANSPORTERS
========================================================= */

export { infoTransporter, bookingsTransporter };
