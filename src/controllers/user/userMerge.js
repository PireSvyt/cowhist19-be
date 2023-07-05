const jwt_decode = require("jwt-decode");
const bcrypt = require("bcrypt");
// BCRYPT https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
const CryptoJS = require("crypto-js");

const User = require("../../models/User.js");

module.exports = userMerge = (req, res, next) => {
  /*
  
  enables to merge two accounts
  
  possible response types
  * user.merge.success
  * user.merge.error.onfindcurrentuser
  * user.merge.error.onfindmergeuser
  * user.merge.error.notfoundcurrentuser
  * user.merge.error.notfoundmergeuser
  * user.merge.error.onsave
  * user.merge.error.missingnewpassword
  
  */

  console.log("user.merge");

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.findOne({ id: decodedToken.id })
    .then((currentUser) => {
      if (currentUser) {
        User.findOne({ login: req.body.mergelogin })
          .then((mergeuser) => {
            if (mergeuser) {
              // Is merge user credential valid?
              // IN DESIGN TO HANDLE MERGE WITH REDIRECT OF ELSE
            } else {
              res.status(403).json({
                type: "user.merge.error.notfoundmergeuser",
              });
            }
          })
          .catch((error) => {
            res.status(400).json({
              type: "user.merge.error.onfindmergeuser",
              error: error,
            });
            console.error(error);
          });
      } else {
        res.status(403).json({
          type: "user.merge.error.notfoundcurrentuser",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        type: "user.merge.error.onfindcurrentuser",
        error: error,
      });
      console.error(error);
    });
};
