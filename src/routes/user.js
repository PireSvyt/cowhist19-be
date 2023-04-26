const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const authCtrl = require("../controllers/auth");

router.post("/invite", authCtrl.authenticate, userCtrl.invite);
router.post("/close", authCtrl.authenticate, userCtrl.close);
router.post("/anonymize", authCtrl.authenticate, userCtrl.anonymize);
router.post("/changepw", authCtrl.authenticate, userCtrl.changepw);
router.post("/changelogin", authCtrl.authenticate, userCtrl.changelogin);
router.post("/merge", authCtrl.authenticate, userCtrl.merge);
router.get("/tables/:id", authCtrl.authenticate, userCtrl.tables);
router.get("/stats/:id", authCtrl.authenticate, userCtrl.stats);
router.get("/:id", authCtrl.authenticate, userCtrl.details);

module.exports = router;
