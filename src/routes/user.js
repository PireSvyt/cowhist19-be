const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userIsActivated = require("../controllers/user/userIsActivated.js");
const userInvite = require("../controllers/user/userInvite.js");
const userDelete = require("../controllers/user/userDelete.js");
//const userTables = require("../controllers/user/userTables.js");
const userDetails = require("../controllers/user/userDetails.js");
const userStats = require("../controllers/user/userStats.js");
const userChangePassword = require("../controllers/user/userChangePassword.js");
const userMerge = require("../controllers/user/userMerge.js");

router.post("/v1/invite", authAuthenticate, userIsActivated, userInvite);
router.delete("/v1", authAuthenticate, userIsActivated, userDelete);
//router.get("/v1/tables", authAuthenticate, userIsActivated, userTables);
router.get("/v1", authAuthenticate, userIsActivated, userDetails);
router.get("/v1/stats", authAuthenticate, userIsActivated, userStats);
router.post(
  "/v1/changepassword",
  authAuthenticate,
  userIsActivated,
  userChangePassword,
);
router.post("/v1/merge", authAuthenticate, userIsActivated, userMerge);

module.exports = router;
