const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");

const adminGetTablesByPlayers = require("../controllers/admin/adminGetTablesByPlayers.js");
const adminGetTablesByGames = require("../controllers/admin/adminGetTablesByGames.js");
const adminGetUsersByStatus = require("../controllers/admin/adminGetUsersByStatus.js");
const adminGetObjectCount = require("../controllers/admin/adminGetObjectCount.js");
const adminGetFeedbackList = require("../controllers/admin/adminGetFeedbackList.js");

const adminPopulate = require("../controllers/admin/adminPopulate.js");
const adminFeedbackClose = require("../controllers/admin/adminFeedbackClose.js");
const adminEmailTest = require("../controllers/admin/adminEmailTest.js");

const adminUserDelete = require("../controllers/admin/adminUserDelete.js");
const adminResetDatabase = require("../controllers/admin/adminResetDatabase");

router.get(
  "/v1/tablesbyplayers",
  authAuthenticate,
  adminAuthenticate,
  adminGetTablesByPlayers,
);
router.get(
  "/v1/tablesbygames",
  authAuthenticate,
  adminAuthenticate,
  adminGetTablesByGames,
);
router.get(
  "/v1/usersbystatus",
  authAuthenticate,
  adminAuthenticate,
  adminGetUsersByStatus,
);
router.get(
  "/v1/objectcount",
  authAuthenticate,
  adminAuthenticate,
  adminGetObjectCount,
);
router.post(
  "/v1/feedbacklist",
  authAuthenticate,
  adminAuthenticate,
  adminGetFeedbackList,
);
router.post("/v1/populate", authAuthenticate, adminAuthenticate, adminPopulate);
router.post(
  "/v1/feedbackclose",
  authAuthenticate,
  adminAuthenticate,
  adminFeedbackClose,
);
router.get(
  "/v1/emailtest",
  authAuthenticate,
  adminAuthenticate,
  adminEmailTest,
);
router.delete(
  "/v1/user/:id",
  authAuthenticate,
  adminAuthenticate,
  adminUserDelete,
);
router.post(
  "/v1/user/:id",
  authAuthenticate,
  adminAuthenticate,
  adminResetDatabase,
);

module.exports = router;
