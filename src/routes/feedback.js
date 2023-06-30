const express = require("express");
const router = express.Router();

const feedbackCreate = require("../controllers/feedback/feedbackCreate.js");

router.post("/v1/feedback", feedbackCreate);

module.exports = router;
