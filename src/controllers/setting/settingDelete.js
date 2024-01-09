require("dotenv").config();
const Setting = require("../../models/Setting.js");

module.exports = settingDelete = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * setting.delete.success
  * setting.delete.error.ondeletegames
  * setting.delete.error.ondeletesetting
  
  */

  if (process.env.DEBUG) {
    console.log("setting.delete");
  }

  Setting.deleteOne({ key: req.params.key })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("setting.delete.success");
        return res.status(200).json({
          type: "setting.delete.success",
          data: deleteOutcome,
        });
      } else {
        console.log("setting.delete.error.outcome");
        return res.status(400).json({
          type: "setting.delete.error.outcome",
          data: deleteOutcome,
        });
      }
    })
    .catch((error) => {
      console.log("setting.delete.error.ondeletesetting");
      console.error(error);
      return res.status(400).json({
        type: "setting.delete.error.ondeletesetting",
        error: error,
      });
    });
};
