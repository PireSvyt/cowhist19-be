const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");

router.post("/signup", authCtrl.signup);
router.post("/activate/:id", authCtrl.activate);
router.post("/login", authCtrl.login);
router.post("/assess", authCtrl.assess);

router.post("/requesttoken", authCtrl.requesttoken);
router.post("/resetpw", authCtrl.resetpw);

module.exports = router;
