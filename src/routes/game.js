const express = require("express");
const router = express.Router();

const gameCtrl = require("../controllers/game.js");
const authCtrl = require("../controllers/auth.js");

router.post("/save", authCtrl.authenticate, gameCtrl.save);
router.delete("/:id", authCtrl.authenticate, gameCtrl.delete);
router.get("/:id", authCtrl.authenticate, gameCtrl.details);

module.exports = router;
