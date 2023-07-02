const Feedback = require("../../models/Feedback.js");

module.exports = feedbackCreate = (req, res, next) => {
  /*
  
  store a feedback
  
  possible response types
  * feedback.create.success
  * feedback.create.error.oncreate
  
  */

  console.log("feedback.create");

  // Create
  const feedbackToSave = new Feedback({ ...req.body });
  feedbackToSave.id = feedbackToSave._id;
  feedbackToSave.status = "open";
  feedbackToSave.date = new Date();
  // Save
  feedbackToSave
    .save()
    .then(() => {
      res.status(201).json({
        type: "feedback.create.success",
        data: {
          id: feedbackToSave._id,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        type: "feedback.create.error.oncreate",
        error: error,
        data: {
          id: "",
        },
      });
      console.error(error);
    });
};
