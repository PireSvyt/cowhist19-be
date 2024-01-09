require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// BCRYPT https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
const CryptoJS = require("crypto-js");

const User = require("../../models/User.js");

module.exports = userChangePassword = (req, res, next) => {
  /*
  
  enables to change password
  
  inputs
  * newpassword
  
  IMPORTANT NOTE : 
    ON PASSWORD CHANGE,
      ENCRYPTION IS DONE IN FRONTEND
      PASSWORD IS UPDATED AS IS
  
  possible response types
  * user.changepassword.success
  * user.changepassword.error.invalidpassword
  * user.changepassword.error.onfind
  * user.changepassword.error.notfound
  * user.changepassword.error.onsave
  * user.changepassword.error.missingnewpassword
  
  */

  if (process.env.DEBUG) {
    console.log("user.changepassword");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.findOne({ userid: decodedToken.userid })
    .then((user) => {
      if (user) {
        let attemptPassword = req.body.currentpassword;
        if (req.body.encryption === true) {
          attemptPassword = CryptoJS.AES.decrypt(
            attemptPassword,
            process.env.ENCRYPTION_KEY,
          ).toString(CryptoJS.enc.Utf8);
        }
        bcrypt.compare(attemptPassword, user.password).then((valid) => {
          if (!valid) {
            return res.status(401).json({
              type: "user.changepassword.error.invalidpassword",
            });
          } else {
            if (req.body.newpassword) {
              user.password = req.body.newpassword;
              user
                .save()
                .then(() => {
                  console.log("user.changepassword.success");
                  return res.status(200).json({
                    type: "user.changepassword.success",
                  });
                })
                .catch((error) => {
                  console.log("user.changepassword.error.onsave");
                  console.error(error);
                  return res.status(400).json({
                    type: "user.changepassword.error.onsave",
                    error: error,
                  });
                });
            } else {
              console.log("user.changepassword.error.missingnewpassword");
              return res.status(403).json({
                type: "user.changepassword.error.missingnewpassword",
              });
            }
          }
        });
      } else {
        console.log("user.changepassword.error.notfound");
        return res.status(403).json({
          type: "user.changepassword.error.notfound",
        });
      }
    })
    .catch((error) => {
      console.log("user.changepassword.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "user.changepassword.error.onfind",
        error: error,
      });
    });
};
