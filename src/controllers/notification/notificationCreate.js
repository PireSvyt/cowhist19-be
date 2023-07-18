const Notification = require("../../models/Notification.js");

module.exports = notificationCreate = (req, res, next) => {
  /*
  
  store a notification
  
  possible response types
  * notification.create.success
  * notification.create.error.oncreate
  * notification.create.error.deniedaccess
  
  */

  console.log("notification.create");

  const notificationToSave = new Notification({ ...req.body });
  notificationToSave.id = notificationToSave._id;
  // Save
  notificationToSave
    .save()
    .then(() => {
      res.status(201).json({
        type: "notification.create.success",
        data: {
          id: notificationToSave._id,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        type: "notification.create.error.oncreate",
        error: error,
        data: {
          id: "",
        },
      });
      console.error(error);
    });
};
