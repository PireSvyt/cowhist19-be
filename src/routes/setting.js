const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");

const settingCreate = require("../controllers/setting/settingCreate.js");
const settingSave = require("../controllers/setting/settingSave.js");
const settingGetOne = require("../controllers/setting/settingGetOne.js");
const settingGetAll = require("../controllers/setting/settingGetAll.js");
const settingDelete = require("../controllers/setting/settingDelete.js");

router.post("/v1/create", 
  authAuthenticate, 
  adminAuthenticate, 
  settingCreate
);
router.post(
  "/v1/save",
  authAuthenticate,
  adminAuthenticate,
  settingSave,
);
router.get(
  "/v1/:key",
  authAuthenticate,
  settingGetOne,
);
router.get(
  "/v1",
  authAuthenticate,
  settingGetAll,
);
router.delete(
  "/v1/:key",
  authAuthenticate,
  adminAuthenticate,
  settingDelete,
);

module.exports = router;
