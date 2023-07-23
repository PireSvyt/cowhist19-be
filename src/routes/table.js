const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const userIsActivated = require("../controllers/user/userIsActivated.js");
const tableAuthenticate = require("../controllers/table/tableAuthenticate.js");

const tableCreate = require("../controllers/table/tableCreate.js");
const tableSave = require("../controllers/table/tableSave.js");
//const tableDetails = require("../controllers/table/tableDetails.js");
const tableDetails_v2 = require("../controllers/table/tableDetails_v2.js");
const tableDelete = require("../controllers/table/tableDelete.js");
//const tableHistory = require("../controllers/table/tableHistory.js");
//const tableHistory_v2 = require("../controllers/table/tableHistory_v2.js");
const tableHistory_v3 = require("../controllers/table/tableHistory_v3.js");
const tableStats = require("../controllers/table/tableStats.js");
const tableExistingName = require("../controllers/table/tableExistingName.js");

router.post("/v1/create", authAuthenticate, userIsActivated, tableCreate);
router.post(
  "/v1/existingname",
  authAuthenticate,
  userIsActivated,
  tableExistingName
);

router.post(
  "/v2/save",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  tableSave
);
router.get(
  "/v2/:id",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  tableDetails_v2
);
router.delete(
  "/v1/:id",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  tableDelete
);
router.post(
  "/v3/history/:id",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  tableHistory_v3
);
router.post(
  "/v1/stats/:id",
  authAuthenticate,
  userIsActivated,
  tableAuthenticate,
  tableStats
);

module.exports = router;
