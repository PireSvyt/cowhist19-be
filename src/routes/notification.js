const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");

const notificationCreate = require("../controllers/notification/notificationCreate.js");

router.post(
  "/v1/notification",
  authAuthenticate,
  adminAuthenticate,
  notificationCreate
);

module.exports = router;
