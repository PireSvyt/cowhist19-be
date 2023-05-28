const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const tablesByPlayers = require("../controllers/admin/tablesByPlayers.js");
const tablesByGames = require("../controllers/admin/tablesByGames.js");
const usersByStatus = require("../controllers/admin/usersByStatus.js");
const populate = require("../controllers/admin/populate.js");

router.get("/v1/tablesbyplayers", authAuthenticate, tablesByPlayers);
router.get("/v1/tablesbygames", authAuthenticate, tablesByGames);
router.get("/v1/usersbystatus", authAuthenticate, usersByStatus);
router.post("/v1/populate", authAuthenticate, populate);

module.exports = router;
