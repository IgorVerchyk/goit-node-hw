const express = require("express");
const controllerContacts = require("../../controllers/contacts");
const router = express.Router();
const validateContact = require("../../validation/validation");
router
  .get("/", controllerContacts.getAll)
  .get("/:id", controllerContacts.getById)
  .post("/", validateContact, controllerContacts.create)
  .put("/:id", validateContact, controllerContacts.update)

  .delete("/:id", controllerContacts.remove);

module.exports = router;
