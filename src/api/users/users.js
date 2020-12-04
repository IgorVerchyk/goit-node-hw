const express = require("express");
const usersController = require("../../controllers/users");
const router = express.Router();
const guard = require("../../helpers/guard");
const { createAccountLimiter } = require("../../helpers/reate-limit");

router.post("/registration", createAccountLimiter, usersController.reg);
router.post("/login", usersController.login);
router.post("/logout", guard, usersController.logout);

module.exports = router;
