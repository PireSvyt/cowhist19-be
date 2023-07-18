const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const adimAuthenticate = require("../controllers/admin/adminAuthenticate.js");
const tablesByPlayers = require("../controllers/admin/tablesByPlayers.js");
const tablesByGames = require("../controllers/admin/tablesByGames.js");
const usersByStatus = require("../controllers/admin/usersByStatus.js");
const objectCount = require("../controllers/admin/objectCount.js");
const populate = require("../controllers/admin/populate.js");
const feedbackList = require("../controllers/admin/feedbackList.js");
const feedbackClose = require("../controllers/admin/feedbackClose.js");
const emailTest = require("../controllers/admin/emailTest.js");

router.get(
  "/v1/tablesbyplayers",
  authAuthenticate,
  adimAuthenticate,
  tablesByPlayers
);
router.get(
  "/v1/tablesbygames",
  authAuthenticate,
  adimAuthenticate,
  tablesByGames
);
router.get(
  "/v1/usersbystatus",
  authAuthenticate,
  adimAuthenticate,
  usersByStatus
);
router.get("/v1/objectcount", authAuthenticate, adimAuthenticate, objectCount);
router.post("/v1/populate", authAuthenticate, adimAuthenticate, populate);
router.post(
  "/v1/feedbacklist",
  authAuthenticate,
  adimAuthenticate,
  feedbackList
);
router.post(
  "/v1/feedbackclose",
  authAuthenticate,
  adimAuthenticate,
  feedbackClose
);
router.get("/v1/emailtest", authAuthenticate, adimAuthenticate, emailTest);

module.exports = router;
