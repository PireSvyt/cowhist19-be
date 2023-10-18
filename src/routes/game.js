const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userIsActivated = require("../controllers/user/userIsActivated.js");

const gameCreate = require("../controllers/game/gameCreate.js");
const gameDelete = require("../controllers/game/gameDelete.js");
//const gameGet = require("../controllers/game/gameGet.js");

router.post("/v1/create", authAuthenticate, userIsActivated, gameCreate);
router.delete("/v1/:id", authAuthenticate, userIsActivated, gameDelete);
//router.get("/v1/:id", authAuthenticate, userIsActivated, gameGet);

module.exports = router;
