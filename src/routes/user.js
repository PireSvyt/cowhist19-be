const express = require("express");
const router = express.Router();

// Old controllers
const userCtrl = require("../controllers/user.js");
const authCtrl = require("../controllers/auth.js");

router.post("/invite", authCtrl.authenticate, userCtrl.invite);
router.post("/close", authCtrl.authenticate, userCtrl.close);
router.post("/anonymize", authCtrl.authenticate, userCtrl.anonymize);
router.post("/changepw", authCtrl.authenticate, userCtrl.changepw);
router.post("/changelogin", authCtrl.authenticate, userCtrl.changelogin);
router.post("/merge", authCtrl.authenticate, userCtrl.merge);
router.get("/tables", authCtrl.authenticate, userCtrl.tables);
router.get("/stats/", authCtrl.authenticate, userCtrl.stats);
router.get("/", authCtrl.authenticate, userCtrl.details);

// V1 controllers
const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userInvite = require("../controllers/user/userInvite.js");
const userTables = require("../controllers/user/userTables");
const userDetails = require("../controllers/user/userDetails");

router.post("/v1/invite", authAuthenticate, userInvite);
router.get("/v1/tables", authAuthenticate, userTables);
router.get("/v1", authAuthenticate, userDetails);

module.exports = router;
