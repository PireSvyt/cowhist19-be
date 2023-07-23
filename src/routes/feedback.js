const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userIsActivated = require("../controllers/user/userIsActivated.js");
const feedbackCreate = require("../controllers/feedback/feedbackCreate.js");

router.post("/v1/create", authAuthenticate, userIsActivated, feedbackCreate);

module.exports = router;
