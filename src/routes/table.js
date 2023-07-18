const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const tableAuthenticate = require("../controllers/auth/tableAuthenticate.js");

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

router.post("/v1/create", authAuthenticate, tableCreate);
router.post("/v2/save", authAuthenticate, tableAuthenticate, tableSave);

//router.get("/v1/:id", authAuthenticate, tableDetails);
router.get("/v2/:id", authAuthenticate, tableAuthenticate, tableDetails_v2);

router.delete("/v1/:id", authAuthenticate, tableAuthenticate, tableDelete);

//router.post("/v1/history/:id", authAuthenticate, tableHistory);
//router.post("/v2/history/:id", authAuthenticate, tableHistory_v2);
router.post(
  "/v3/history/:id",
  authAuthenticate,
  tableAuthenticate,
  tableHistory_v3
);

router.post("/v1/stats/:id", authAuthenticate, tableAuthenticate, tableStats);

router.post("/v1/existingname", authAuthenticate, tableExistingName);

module.exports = router;
