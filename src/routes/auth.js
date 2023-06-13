const express = require("express");
const router = express.Router();

const authSignUp = require("../controllers/auth/authSignUp.js");
const authActivate = require("../controllers/auth/authActivate.js");
const authSignIn = require("../controllers/auth/authSignIn.js");
const authAssess = require("../controllers/auth/authAssess.js");
const authExistingPseudo = require("../controllers/auth/authExistingPseudo");

router.post("/v1/signup", authSignUp);
router.post("/v1/activate", authActivate);
router.post("/v1/signin", authSignIn);
router.post("/v1/assess", authAssess);
router.post("/v1/existingpseudo", authExistingPseudo);

module.exports = router;
