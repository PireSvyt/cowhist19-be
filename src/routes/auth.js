const express = require("express");
const router = express.Router();

// Old controllers
const authCtrl = require("../controllers/auth.js");

router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);
router.post("/assess", authCtrl.assess);

// V1 controllers
const authSignUp = require("../controllers/auth/authSignUp.js");
const authActivate = require("../controllers/auth/authActivate.js");
const authSignin = require("../controllers/auth/authSignin.js");
const authAssess = require("../controllers/auth/authAssess.js");

router.post("/v1/signup", authSignUp);
router.post("/v1/activate", authActivate);
router.post("/v1/signin", authSignin);
router.post("/v1/assess", authAssess);

module.exports = router;
