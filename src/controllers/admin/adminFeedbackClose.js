require("dotenv").config();
const Feedback = require("../../models/Feedback.js");

module.exports = adminFeedbackClose = (req, res, next) => {
  /*
  
  enables to close a feedback
  
  possible response types
  * admin.feedbackclose.success
  * admin.feedbackclose.error.deniedaccess
  * admin.feedbackclose.error.onsave
  * admin.feedbackclose.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("admin.feedbackClose");
  }

  Feedback.find({ _id: req.params.id })
    .then((feedback) => {
      feedback.status = "close";
      // Feedback saving
      feedback
        .save()
        .then(() => {
          res.status(200).json({
            type: "admin.feedbackclose.success",
            data: {
              id: feedback._id,
            },
          });
        })
        .catch((error) => {
          res.status(400).json({
            type: "admin.feedbackclose.error.onsave",
            error: error,
            data: {
              id: feedback._id,
            },
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        type: "admin.feedbackclose.error.onfind",
        error: error,
      });
      console.error(error);
    });
};
