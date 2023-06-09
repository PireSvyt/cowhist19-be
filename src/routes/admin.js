const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const tablesByPlayers = require("../controllers/admin/tablesByPlayers.js");
const tablesByGames = require("../controllers/admin/tablesByGames.js");
const usersByStatus = require("../controllers/admin/usersByStatus.js");
const objectCount = require("../controllers/admin/objectCount.js");
const populate = require("../controllers/admin/populate.js");
const feedbackList = require("../controllers/admin/feedbackList.js");
const feedbackClose = require("../controllers/admin/feedbackClose.js");

router.get("/v1/tablesbyplayers", authAuthenticate, tablesByPlayers);
router.get("/v1/tablesbygames", authAuthenticate, tablesByGames);
router.get("/v1/usersbystatus", authAuthenticate, usersByStatus);
router.get("/v1/objectcount", authAuthenticate, objectCount);
router.post("/v1/populate", authAuthenticate, populate);
router.post("/v1/feedbacklist", authAuthenticate, feedbackList);
router.post("/v1/feedbackclose", authAuthenticate, feedbackClose);

module.exports = router;
