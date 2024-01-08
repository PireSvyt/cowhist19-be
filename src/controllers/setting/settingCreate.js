require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * setting.create.success
  * setting.create.error.oncreate
  * setting.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("setting.create");
  }

  // Save
  let settingToSave = { ...req.body };
  settingToSave = new Setting(settingToSave);

  // Save
  settingToSave
    .save()
    .then(() => {
      console.log("setting.create.success");
      return res.status(201).json({
        type: "setting.create.success",
        data: {
            key: settingToSave.key,
        },
      });
    })
    .catch((error) => {
      console.log("setting.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "setting.create.error.oncreate",
        error: error,
        data: {
            key: null,
        },
      });
    });
};
