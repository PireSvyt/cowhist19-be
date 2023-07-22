const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userInvite = require("../controllers/user/userInvite.js");
const userDelete = require("../controllers/user/userDelete.js");
const userTables = require("../controllers/user/userTables.js");
const userDetails = require("../controllers/user/userDetails.js");
const userStats = require("../controllers/user/userStats.js");
const userChangePassword = require("../controllers/user/userChangePassword.js");
const userMerge = require("../controllers/user/userMerge.js");
const userResetPassword = require("../controllers/user/userResetPassword.js");

router.post("/v1/resetpassword", userResetPassword);

router.post("/v1/invite", authAuthenticate, userInvite);
router.delete("/v1", authAuthenticate, userDelete);
router.get("/v1/tables", authAuthenticate, userTables);
router.get("/v1", authAuthenticate, userDetails);
router.get("/v1/stats", authAuthenticate, userStats);
router.post("/v1/changepassword", authAuthenticate, userChangePassword);
router.post("/v1/merge", authAuthenticate, userMerge);

module.exports = router;
