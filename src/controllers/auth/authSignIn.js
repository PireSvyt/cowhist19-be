const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// BCRYPT https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
const CryptoJS = require("crypto-js");

const User = require("../../models/User.js");

module.exports = authSignIn = (req, res, next) => {
  /*
  
  sign in a user
  sends back a jwt token
  
  IMPORTANT NOTE : 
    PASSWORD IS ENCRYPTED IN FRONTEND 
    AND DECRYPTED FOR BCRYPT COMPARE HERE
  
  possible response types
  * auth.signin.success
  * auth.signin.error.notfound
  * auth.signin.error.onfind
  * auth.signin.error.invalidpassword
  * auth.signin.error.onpasswordcompare
  * auth.signin.error.statussignedup
  * auth.signin.error.statusunknown
  
  */

  console.log("auth.signin");

  let attemptLogin = req.body.login;
  // Login decrypt
  if (req.body.encryption === true) {
    attemptLogin = CryptoJS.AES.decrypt(
      attemptLogin,
      process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
  }

  User.findOne({ login: attemptLogin })
    .then((user) => {
      if (!user) {
        // Inexisting user
        return res.status(404).json({
          type: "auth.signin.error.notfound",
          data: {
            id: "",
            token: "",
          },
        });
      } else {
        let attemptPassword = req.body.password;
        // Password decrypt
        if (req.body.encryption === true) {
          attemptPassword = CryptoJS.AES.decrypt(
            attemptPassword,
            process.env.ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8);
        }

        // Password compare
        bcrypt
          .compare(attemptPassword, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({
                type: "auth.signin.error.invalidpassword",
                data: {
                  id: "",
                  token: "",
                },
              });
            } else {
              switch (user.status) {
                case "signedup":
                  return res.status(401).json({
                    type: "auth.signin.error.statussignedup",
                    data: {
                      id: user._id,
                      token: "",
                    },
                  });
                  break;
                case "activated":
                  // Store sign in date
                  /*if (user.connection === undefined) {
                      user.connection = {};
                    }
                    if (user.connection.current !== undefined) {
                      user.connection.last = user.connection.current;
                    }
                    user.connection.current = new Date();
                    user.save();*/
                  // Return response
                  return res.status(200).json({
                    type: "auth.signin.success",
                    data: {
                      id: user._id,
                      token: jwt.sign(
                        {
                          id: user._id,
                          status: user.status,
                        },
                        process.env.JWT_SECRET,
                        {
                          expiresIn: "72h",
                        }
                      ),
                    },
                  });
                  break;
                default:
                  return res.status(401).json({
                    type: "auth.signin.error.statusunknown",
                    data: {
                      id: user._id,
                      token: "",
                    },
                  });
              }
            }
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({
              type: "auth.signin.error.onpasswordcompare",
              error: error,
              data: {
                id: "",
                token: "",
              },
            });
          });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        type: "auth.signin.error.onfind",
        error: error,
        data: {
          id: "",
          token: "",
        },
      });
    });
};
