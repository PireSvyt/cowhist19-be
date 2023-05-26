const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const tablesByGames = require("../controllers/admin/tablesByGames.js");
const usersByStatus = require("../controllers/admin/usersByStatus.js");

router.get("/v1/tablebygames", authAuthenticate, tablesByGames);
router.get("/v1/usersbystatus", authAuthenticate, usersByStatus);

module.exports = router;
