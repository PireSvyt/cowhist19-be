const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");

router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);

router.post("/requesttoken", userCtrl.requesttoken);
router.post("/resetpw", userCtrl.resetpw);

module.exports = router;