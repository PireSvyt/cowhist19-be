const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const tableAuthenticate = require("../controllers/auth/tableAuthenticate.js");

const gameSave = require("../controllers/game/gameSave.js");
const gameDelete = require("../controllers/game/gameDelete.js");
const gameDetails = require("../controllers/game/gameDetails.js");

router.post("/v1/save", authAuthenticate, tableAuthenticate, gameSave);
router.delete("/v1/:id", authAuthenticate, tableAuthenticate, gameDelete);
router.get("/v1/:id", authAuthenticate, tableAuthenticate, gameDetails);

module.exports = router;
