const User = require("../../models/User.js");
const Table = require("../../models/Table.js");
const Game = require("../../models/Game.js");
const Feedback = require("../../models/Feedback.js");

module.exports = adminGetObjectCount = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.objectcount.success
  * admin.objectcount.error.deniedaccess
  * admin.objectcount.error.oncountusers
  * admin.objectcount.error.oncounttables
  * admin.objectcount.error.oncountgames
  * admin.objectcount.error.oncountfeedbacks
  
  */

  console.log("admin.objectcount");

  User.count()
    .then((users) => {
      Table.count()
        .then((tables) => {
          Game.count()
            .then((games) => {
              Feedback.count()
                .then((feedbacks) => {
                  res.status(200).json({
                    type: "admin.objectcount.success",
                    data: {
                      users: users,
                      tables: tables,
                      games: games,
                      feedbacks: feedbacks,
                    },
                  });
                })
                .catch((error) => {
                  res.status(400).json({
                    type: "admin.objectcount.error.oncountfeedbacks",
                    error: error,
                  });
                  console.error(error);
                });
            })
            .catch((error) => {
              res.status(400).json({
                type: "admin.objectcount.error.oncountgames",
                error: error,
              });
              console.error(error);
            });
        })
        .catch((error) => {
          res.status(400).json({
            type: "admin.objectcount.error.oncounttables",
            error: error,
          });
          console.error(error);
        });
    })
    .catch((error) => {
      res.status(400).json({
        type: "admin.objectcount.error.oncountusers",
        error: error,
      });
      console.error(error);
    });
};
