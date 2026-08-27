import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsFile = path.join(__dirname, "../../data/contacts.json");

export const createContact = (req, res) => {
  try {
    const { name, email, phone, enquiry, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please complete the required contact fields.",
      });
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

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      contact,
    });
  } catch (error) {
    console.error("Contact error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to send your message.",
    });
  }
};

export const getContacts = (req, res) => {
  try {
    if (!fs.existsSync(contactsFile)) {
      fs.writeFileSync(contactsFile, "[]");
    }

    const contacts = JSON.parse(fs.readFileSync(contactsFile, "utf8"));

    res.json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load contact enquiries.",
    });
  }
};
