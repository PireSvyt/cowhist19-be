const express = require("express");
const router = express.Router();
const mailbox = require("../mailbox/mailbox");

router.post("/", mailbox.sendEmail);

module.exports = router;
