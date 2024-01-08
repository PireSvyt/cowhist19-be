require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingSave = (req, res, next) => {
  /*
  
  saves a setting
  
  possible response types
  * setting.save.error.emptyid
  * setting.save.success.modified
  * setting.save.error.onfind
  * setting.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("setting.save");
  }

  // Save
  if (req.body.settingid === "" || req.body.settingid === undefined) {
    console.log("setting.save.error.emptyid");
    return res.status(503).json({
      type: "setting.save.error.emptyid",
      error: error,
    });
  } else {
    // Modify
    let settingToSave = { ...req.body };

    // Manage setting to users
    Setting.findOne({ settingid: settingToSave.settingid })
      .then(() => {
        // Save
        Setting.updateOne({ settingid: settingToSave.settingid }, settingToSave)
          .then(() => {
            console.log("setting.save.success.modified");
            return res.status(200).json({
              type: "setting.save.success.modified",
              data: {
                settingid: settingToSave.settingid,
              },
            });
          })
          .catch((error) => {
            console.log("setting.save.error.onmodify");
            console.error(error);
            return res.status(400).json({
              type: "setting.save.error.onmodify",
              error: error,
            });
          });
      })
      .catch((error) => {
        console.log("setting.save.error.onfind");
        console.error(error);
        return res.status(400).json({
          type: "setting.save.error.onfind",
          error: error,
        });
      });
  }
};
