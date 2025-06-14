const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userIsActivated = require("../controllers/user/userIsActivated.js");
const tableAuthenticate = require("../controllers/table/tableAuthenticate.js");

const gameCreate = require("../controllers/game/gameCreate.js");
const gameDelete = require("../controllers/game/gameDelete.js");
const gameGetOldest = require("../controllers/game/gameGetOldest.js");

router.post(
  "/v1/create",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  gameCreate
);
router.post(
  "/v1/delete",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  gameDelete
);
router.get(
  "/v1/oldest",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  gameGetOldest
);

module.exports = router;
