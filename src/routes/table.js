const express = require("express");
const router = express.Router();

// Old controllers
const authCtrl = require("../controllers/auth.js");
const tableCtrl = require("../controllers/table.js");

router.post("/save", authCtrl.authenticate, tableCtrl.save);
router.get("/:id", authCtrl.authenticate, tableCtrl.details);
router.delete("/:id", authCtrl.authenticate, tableCtrl.delete);
router.post("/history/:id", authCtrl.authenticate, tableCtrl.history);
router.post("/stats/:id", authCtrl.authenticate, tableCtrl.stats);

// V1 controllers
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
