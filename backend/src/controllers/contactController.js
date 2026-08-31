import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsFile = path.join(__dirname, "../../data/contacts.json");

/* =========================================================
   CREATE CONTACT
========================================================= */

export const createContact = (req, res) => {
  try {
    const { name, email, phone, enquiry, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please complete the required contact fields.",
      });
    }

    if (!fs.existsSync(contactsFile)) {
      fs.writeFileSync(contactsFile, "[]");
    }

    const contacts = JSON.parse(fs.readFileSync(contactsFile, "utf8"));

    const contact = {
      id: `EN-${Date.now()}`,
      type: "contact",

      name,
      email,
      phone: phone || "",
      enquiry: enquiry || "other",
      message,

      status: "unread",

      createdAt: new Date().toISOString(),
    };

    contacts.push(contact);

    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));

    console.log("NEW CONTACT ENQUIRY:", contact);

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      contact,
    });
  } catch (error) {
    console.error("Contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message.",
    });
  }
};

/* =========================================================
   GET ALL CONTACTS
========================================================= */

export const getContacts = (req, res) => {
  try {
    if (!fs.existsSync(contactsFile)) {
      fs.writeFileSync(contactsFile, "[]");
    }

    const contacts = JSON.parse(fs.readFileSync(contactsFile, "utf8"));

    return res.json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load contact enquiries.",
    });
  }
};

/* =========================================================
   MARK CONTACT AS READ
========================================================= */

export const markContactAsRead = (req, res) => {
  try {
    const { id } = req.params;

    if (!fs.existsSync(contactsFile)) {
      return res.status(404).json({
        success: false,
        message: "Contacts file not found.",
      });
    }

    const contacts = JSON.parse(fs.readFileSync(contactsFile, "utf8"));

    const contactIndex = contacts.findIndex((contact) => contact.id === id);

    if (contactIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Contact enquiry not found.",
      });
    }

    contacts[contactIndex].status = "read";

    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));

    console.log(`CONTACT MARKED AS READ: ${id}`);

    return res.json({
      success: true,
      message: "Contact marked as read.",
      contact: contacts[contactIndex],
    });
  } catch (error) {
    console.error("Mark contact as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update contact status.",
    });
  }
};

/* =========================================================
   DELETE CONTACT
========================================================= */

export const deleteContact = (req, res) => {
  try {
    const { id } = req.params;

    if (!fs.existsSync(contactsFile)) {
      return res.status(404).json({
        success: false,
        message: "Contacts file not found.",
      });
    }

    const contacts = JSON.parse(fs.readFileSync(contactsFile, "utf8"));

    const contactIndex = contacts.findIndex((contact) => contact.id === id);

    if (contactIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Contact enquiry not found.",
      });
    }

    const deletedContact = contacts[contactIndex];

    contacts.splice(contactIndex, 1);

    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));

    console.log(`CONTACT DELETED: ${id}`);

    return res.json({
      success: true,
      message: "Contact enquiry deleted successfully.",
      contact: deletedContact,
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete contact enquiry.",
    });
  }
};
