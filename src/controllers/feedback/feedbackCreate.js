require("dotenv").config();
const Feedback = require("../../models/Feedback.js");

module.exports = feedbackCreate = (req, res, next) => {
  /*
  
  store a feedback
  
  possible response types
  * feedback.create.success
  * feedback.create.error.oncreate
  
  */

  if (process.env.DEBUG) {
    console.log("feedback.create");
  }

  // Create
  const feedbackToSave = new Feedback({ ...req.body });
  feedbackToSave.id = feedbackToSave._id;
  feedbackToSave.status = "open";
  feedbackToSave.date = new Date();
  // Save
  feedbackToSave
    .save()
    .then(() => {
      console.log("feedback.create.success");
      return res.status(201).json({
        type: "feedback.create.success",
        data: {
          id: feedbackToSave._id,
        },
      });
    })
    .catch((error) => {
      console.log("feedback.create.error.oncreate");
      return res.status(400).json({
        type: "feedback.create.error.oncreate",
        error: error,
        data: {
          id: "",
        },
      });
      console.error(error);
    });
};
