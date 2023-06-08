const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userInvite = require("../controllers/user/userInvite.js");
const userDelete = require("../controllers/user/userDelete");
const userTables = require("../controllers/user/userTables");
const userDetails = require("../controllers/user/userDetails");

router.post("/v1/invite", authAuthenticate, userInvite);
router.delete("/v1", authAuthenticate, userDelete);
router.get("/v1/tables", authAuthenticate, userTables);
router.get("/v1", authAuthenticate, userDetails);

module.exports = router;
