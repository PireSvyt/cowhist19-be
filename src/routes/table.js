const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userIsActivated = require("../controllers/user/userIsActivated.js");
const tableAuthenticate = require("../controllers/table/tableAuthenticate.js");

const tableCreate = require("../controllers/table/tableCreate.js");
const tableSave = require("../controllers/table/tableSave.js");
const tableGetDetails = require("../controllers/table/tableGetDetails.js");
const tableDelete = require("../controllers/table/tableDelete.js");
const tableGetHistory = require("../controllers/table/tableGetHistory.js");
const tableGetStats = require("../controllers/table/tableGetStats.js");
const tableExistingName = require("../controllers/table/tableExistingName.js");

router.post("/v1/create", authAuthenticate, userIsActivated, tableCreate);
router.post(
  "/v1/existingname",
  authAuthenticate,
  userIsActivated,
  tableExistingName,
);

router.post(
  "/v2/save",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  tableSave,
);
router.get(
  "/v3/:tableid",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  tableGetDetails,
);
router.delete(
  "/v1/:tableid",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  tableDelete,
);
router.post(
  "/v3/history/:tableid",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  tableGetHistory,
);
router.post(
  "/v1/stats/:tableid",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  tableGetStats,
);

module.exports = router;
