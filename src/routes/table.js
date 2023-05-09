const express = require("express");
const router = express.Router();

// Old controllers
const authCtrl = require("../controllers/auth.js");

const tableCtrl = require("../controllers/tableCtrl.js");
router.post("/save/v1", authCtrl.authenticate, tableCtrl.save);
router.get("/v1/:id", authCtrl.authenticate, tableCtrl.details);
router.delete("/v1/:id", authCtrl.authenticate, tableCtrl.delete);
router.post("/history/v1/:id", authCtrl.authenticate, tableCtrl.history);
router.post("/stats/v1/:id", authCtrl.authenticate, tableCtrl.stats);

// New controllers
const tableSave = require("../controllers/table/tableSave.js");
const tableDetails = require("../controllers/table/tableDetails.js");
const tableDelete = require("../controllers/table/tableDelete.js");
const tableHistory = require("../controllers/table/tableHistory.js");
const tableStats = require("../controllers/table/tableStats.js");

router.post("/save/v1", authCtrl.authenticate, tableSave);
router.get("/v1/:id", authCtrl.authenticate, tableDetails);
router.delete("/v1/:id", authCtrl.authenticate, tableDelete);
router.post("/history/v1/:id", authCtrl.authenticate, tableHistory);
router.post("/stats/v1/:id", authCtrl.authenticate, tableStats);

module.exports = router;
