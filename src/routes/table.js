const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const tableSave = require("../controllers/table/tableSave.js");
const tableDetails = require("../controllers/table/tableDetails.js");
const tableDelete = require("../controllers/table/tableDelete.js");
const tableHistory = require("../controllers/table/tableHistory.js");
const tableStats = require("../controllers/table/tableStats.js");

router.post("/v1/save", authAuthenticate, tableSave);
router.get("/v1/:id", authAuthenticate, tableDetails);
router.delete("/v1/:id", authAuthenticate, tableDelete);
router.post("/v1/history/:id", authAuthenticate, tableHistory);
router.post("/v1/stats/:id", authAuthenticate, tableStats);

module.exports = router;
