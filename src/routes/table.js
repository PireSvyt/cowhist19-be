const express = require("express");
const router = express.Router();

// Old controllers
const authCtrl = require("../controllers/auth.js");

const tableCtrl = require("../controllers/tableCtrl.js");
router.post("/save", authCtrl.authenticate, tableCtrl.save);
router.get("/:id", authCtrl.authenticate, tableCtrl.details);
router.delete("/:id", authCtrl.authenticate, tableCtrl.delete);
router.post("/history/:id", authCtrl.authenticate, tableCtrl.history);
router.post("/stats/:id", authCtrl.authenticate, tableCtrl.stats);

// V1 controllers
const tableSave = require("../controllers/table/tableSave.js");
const tableDetails = require("../controllers/table/tableDetails.js");
const tableDelete = require("../controllers/table/tableDelete.js");
const tableHistory = require("../controllers/table/tableHistory.js");
const tableStats = require("../controllers/table/tableStats.js");

router.post("/v1/save", authCtrl.authenticate, tableSave);
router.get("/v1/table/:id", authCtrl.authenticate, tableDetails);
router.delete("/v1/table/:id", authCtrl.authenticate, tableDelete);
router.post("/v1/history/:id", authCtrl.authenticate, tableHistory);
router.post("/v1/stats/:id", authCtrl.authenticate, tableStats);

module.exports = router;
