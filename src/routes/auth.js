const express = require("express");
const router = express.Router();

const authSignUp = require("../controllers/auth/authSignUp.js");
const authActivate = require("../controllers/auth/authActivate.js");
const authSignIn = require("../controllers/auth/authSignIn.js");
const authAssess = require("../controllers/auth/authAssess.js");
const authExistingPseudo = require("../controllers/auth/authExistingPseudo.js");
const authResentActivation = require("../controllers/auth/authResentActivation.js");
//const authResetPassword = require("../controllers/auth/authResetPassword.js");

router.post("/v1/signup", authSignUp);
router.post("/v1/activate/:token", authActivate);
router.post("/v1/signin", authSignIn);
router.post("/v1/assess", authAssess);
router.post("/v1/existingpseudo", authExistingPseudo);
router.post("/v1/resentactivation", authResentActivation);
//router.post("/v1/resetpassword", authResetPassword);

module.exports = router;
