const Notification = require("../../models/Notification.js");
const serviceCheckAdmin = require("./services/serviceCheckAdmin.js");

module.exports = notificationCreate = (req, res, next) => {
  /*
  
  store a notification
  
  possible response types
  * notification.create.success
  * notification.create.error.oncreate
  * notification.create.error.deniedaccess
  
  */

  console.log("notification.create");

  // Check access
  serviceCheckAdmin(req.headers["authorization"]).then((access) => {
    if (!access.outcome) {
      // Unauthorized
      res.status(401).json({
        type: "notification.create.error.deniedaccess",
        error: access.reason,
      });
    } else {
      // Create
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
    }
  });
};
