const express = require("express");
const router = express.Router();
const tableCtrl = require("../controllers/table");
const authCtrl = require("../controllers/auth");

router.post("/save", authCtrl.authenticate, tableCtrl.save);
router.delete("/:id", authCtrl.authenticate, tableCtrl.delete);
router.get("/:id", authCtrl.authenticate, tableCtrl.details);
router.post("/stats/:id", authCtrl.authenticate, tableCtrl.stats);
router.post("/history/:id", authCtrl.authenticate, tableCtrl.history);

module.exports = router;