const express = require("express");
const router = express.Router();

// Old controllers
const authCtrl = require("../controllers/auth.js");

router.post("/signup", authCtrl.signup);
router.post("/activate/:id", authCtrl.activate);
router.post("/login", authCtrl.login);
router.post("/assess", authCtrl.assess);

router.post("/requesttoken", authCtrl.requesttoken);
router.post("/resetpw", authCtrl.resetpw);

// New controllers
const authSignUp = require("../controllers/auth/authSignUp.js");

router.post("/signup/v1", authSignUp);

module.exports = router;
