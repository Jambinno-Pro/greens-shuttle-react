import express from "express";

import {
  createContact,
  getContacts,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

/* =========================================================
   CREATE CONTACT
========================================================= */

router.post("/", createContact);

/* =========================================================
   GET ALL CONTACTS
========================================================= */

router.get("/", getContacts);

/* =========================================================
   DELETE CONTACT
========================================================= */

router.delete("/:id", deleteContact);

export default router;
