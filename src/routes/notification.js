const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const notificationCreate = require("../controllers/notification/notificationCreate.js");

router.post("/v1/notification", authAuthenticate, notificationCreate);

module.exports = router;
