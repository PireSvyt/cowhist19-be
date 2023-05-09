const express = require("express");
const router = express.Router();

// Old controllers
const authCtrl = require("../controllers/auth");

// New controllers
const tableSave = require("../controllers/table/tableSave");
const tableDetails = require("../controllers/table/tableDetails");
const tableDelete = require("../controllers/table/tableDelete");
const tableHistory = require("../controllers/table/tableHistory");
const tableStats = require("../controllers/table/tableStats");

router.post("/save", authCtrl.authenticate, tableSave);
router.get("/:id", authCtrl.authenticate, tableDetails);
router.delete("/:id", authCtrl.authenticate, tableDelete);
router.post("/history/:id", authCtrl.authenticate, tableHistory);
router.post("/stats/:id", authCtrl.authenticate, tableStats);

module.exports = router;
