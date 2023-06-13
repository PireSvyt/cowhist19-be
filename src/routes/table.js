const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const tableSave = require("../controllers/table/tableSave.js");
const tableDetails = require("../controllers/table/tableDetails.js");
const tableDetails_v2 = require("../controllers/table/tableDetails_v2.js");
const tableDelete = require("../controllers/table/tableDelete.js");
const tableHistory = require("../controllers/table/tableHistory.js");
const tableHistory_v2 = require("../controllers/table/tableHistory_v2.js");
const tableStats = require("../controllers/table/tableStats.js");
const tableExistingName = require("../controllers/table/tableExistingName.js");

router.post("/v1/save", authAuthenticate, tableSave);

router.get("/v1/:id", authAuthenticate, tableDetails);
router.get("/v2/:id", authAuthenticate, tableDetails_v2);

router.delete("/v1/:id", authAuthenticate, tableDelete);

router.post("/v1/history/:id", authAuthenticate, tableHistory);
router.post("/v2/history/:id", authAuthenticate, tableHistory_v2);

router.post("/v1/stats/:id", authAuthenticate, tableStats);

router.post("/v1/existingname", authAuthenticate, tableExistingName);

module.exports = router;
