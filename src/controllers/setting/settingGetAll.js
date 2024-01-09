require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingGetAll = (req, res, next) => {
  /*
  
  sends back all the settings
  
  possible response types
  * settings.get.success
  
  */

  if (process.env.DEBUG) {
    console.log("settings.get");
  }

  Setting.findOne({ }, "key description value")
    .then((settings) => {
      if (settings !== undefined) {
        console.log("setting.get.success");
        return res.status(200).json({
          type: "settings.get.success",
          data: {
            settings: settings,
          },
        });
      } else {
        console.log("setting.get.error.notfound");
        return res.status(101).json({
          type: "settings.get.error.notfound",
          data: {
            settings: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("settings.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "settings.get.error.onfind",
        error: error,
        data: {
            settings: [],
        },
      });
    });
};
