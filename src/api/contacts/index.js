const express = require("express");
const controllerContacts = require("../../controllers/contacts");
const router = express.Router();
const {
  validateUpdateContact,
  validateContact,
} = require("../../validation/validation");
router
  .get("/", controllerContacts.getAll)
  .get("/:id", controllerContacts.getById)
  .post("/", validateContact, controllerContacts.create)
  .patch("/:id", validateUpdateContact, controllerContacts.update)

  .delete("/:id", controllerContacts.remove);

module.exports = router;
