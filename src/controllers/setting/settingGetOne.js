require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingGetOne = (req, res, next) => {
  /*
  
  sends back the setting
  
  possible response types
  * setting.get.success
  
  */

  if (process.env.DEBUG) {
    console.log("setting.getone");
  }

  Setting.findOne({ key: req.params.key }, "key description value")
    .then((setting) => {
      if (setting !== undefined) {
        console.log("setting.get.success");
        return res.status(200).json({
          type: "setting.get.success",
          data: {
            setting: setting,
          },
        });
      } else {
        console.log("setting.get.error.notfound");
        return res.status(101).json({
          type: "setting.get.error.notfound",
          data: {
            setting: {},
          },
        });
      }
    })
    .catch((error) => {
      console.log("setting.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "setting.get.error.onfind",
        error: error,
        data: {
          setting: {},
        },
      });
    });
};
