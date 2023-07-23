const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userIsActivated = require("../controllers/user/userIsActivated.js");
const tableAuthenticate = require("../controllers/table/tableAuthenticate.js");

const gameSave = require("../controllers/game/gameSave.js");
const gameDelete = require("../controllers/game/gameDelete.js");
const gameDetails = require("../controllers/game/gameDetails.js");

router.post(
  "/v1/save",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  gameSave
);
router.delete(
  "/v1/:id",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  gameDelete
);
router.get(
  "/v1/:id",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  gameDetails
);

module.exports = router;
