require("dotenv").config();
const Notification = require("../../models/Notification.js");

module.exports = notificationCreate = (req, res, next) => {
  /*
  
  store a notification
  
  possible response types
  * notification.create.success
  * notification.create.error.oncreate
  * notification.create.error.deniedaccess
  
  */

  if (process.env.DEBUG) {
    console.log("notification.create");
  }

  const notificationToSave = new Notification({ ...req.body });
  if (notificationToSave.id === undefined) {
    notificationToSave.id = notificationToSave._id;
  }
  // Save
  notificationToSave
    .save()
    .then(() => {
      console.log("notification.create.success");
      return res.status(201).json({
        type: "notification.create.success",
        data: {
          id: notificationToSave.id,
        },
      });
    })
    .catch((error) => {
      console.log("notification.create.error.oncreate");
      console.error(error);
      return res.status(400).json({
        type: "notification.create.error.oncreate",
        error: error,
        data: {
          id: "",
        },
      });
    });
};
