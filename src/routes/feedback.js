const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const feedbackCreate = require("../controllers/feedback/feedbackCreate.js");

router.post("/v1/feedback", authAuthenticate, feedbackCreate);

module.exports = router;
