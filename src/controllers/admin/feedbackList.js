const Feedback = require("../../models/Feedback.js");
const serviceCheckAdmin = require("./services/serviceCheckAdmin.js");

module.exports = feedbackList = (req, res, next) => {
  /*
  
  provides the list of feedback
  
  body parameters
  * need : for post processing purpose
    - all : sends the list of all feedback with all details (except userid, consent)
    - allopen : sends the list of all open feedback
    
  TODO
  * filter on state : open / closed ... to narrow down the list
    default : all
  * filter on source : ...
  * filter on tag : ...
  
  possible response types
  * admin.feedbacklist.success
  * admin.feedbacklist.error.deniedaccess
  * admin.feedbacklist.accessdenied.noneed
  * admin.feedbacklist.accessdenied.needmissmatch
  * admin.feedbacklist.error.onfind
  
  */

  console.log("admin.feedbackList");

  // Check access
  serviceCheckAdmin(req.headers["authorization"]).then((access) => {
    if (!access.outcome) {
      // Unauthorized
      res.status(401).json({
        type: "admin.feedbacklist.error.deniedaccess",
        error: access.reason,
      });
    } else {
      // Is need input relevant?
      if (!req.body.need) {
        status = 403;
        type = "admin.feedbacklist.accessdenied.noneed";
      } else {
        switch (req.body.need) {
          case "all":
            filters = {};
            fields = "id status date source tag text";
            break;
          case "allopen":
            filters = { status: "open" };
            fields = "id status date source tag text";
            break;
          default:
            status = 403;
            type = "admin.feedbacklist.accessdenied.needmissmatch";
        }
        //
        Feedback.find(filters, fields)
          .then((feedbacks) => {
            res.status(200).json({
              type: "admin.feedbacklist.success",
              data: {
                feedbacks: feedbacks,
              },
            });
          })
          .catch((error) => {
            res.status(400).json({
              type: "admin.feedbacklist.error.onfind",
              error: error,
            });
            console.error(error);
          });
      }
    }
  });
};
