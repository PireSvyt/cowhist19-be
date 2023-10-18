const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userIsActivated = require("../controllers/user/userIsActivated.js");
const tableAuthenticate = require("../controllers/table/tableAuthenticate.js");

const gameCreate = require("../controllers/game/gameCreate.js");
const gameDelete = require("../controllers/game/gameDelete.js");
const gameDetails = require("../controllers/game/gameDetails.js");

router.post("/v1/create", authAuthenticate, userIsActivated, gameCreate);
router.delete(
  "/v1/:id",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  gameDelete,
);
router.get(
  "/v1/:id",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  gameDetails,
);

module.exports = router;
