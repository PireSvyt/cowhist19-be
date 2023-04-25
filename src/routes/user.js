const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const authCtrl = require("../controllers/auth");

router.post("/invite", authCtrl.authenticate, userCtrl.invite);
router.post("/close", authCtrl.authenticate, userCtrl.close);
router.post("/anonymize", authCtrl.authenticate, userCtrl.anonymize);
router.post("/changepw", authCtrl.authenticate, userCtrl.changepw);
router.post("/changelogin", authCtrl.authenticate, userCtrl.changelogin);
router.get("/tables", authCtrl.authenticate, userCtrl.tables);
router.get("/stats", authCtrl.authenticate, userCtrl.stats);
router.get("/details", authCtrl.authenticate, userCtrl.details);

module.exports = router;
