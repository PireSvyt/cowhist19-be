const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// BCRYPT https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
const CryptoJS = require("crypto-js");

const User = require("../../models/User.js");

module.exports = authSignIn = (req, res, next) => {
  /*
  
  sign in a user
  sends back a jwt token
  
  IMPORTANT NOTE : PASSWORD IS ENCRYPTED IN FE AND DECRYPTED FOR BCRYPT COMPARE
  
  possible response types
  * auth.signin.success
  * auth.signin.error.notfound
  * auth.signin.error.onfind
  * auth.signin.error.invalidpassword
  * auth.signin.error.onpasswordcompare
  
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

  User.findOne(
    { login: attemptLogin },
    "pseudo login status priviledges password"
  )
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
              // Store sign in date
              if (!user.meta) {
                user.meta = {};
              }
              if (!user.meta.connection) {
                user.meta.connection = {};
              }
              user.meta.connection.last = user.meta.connection.current;
              user.meta.connection.current = new Date();
              user.save();
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
                      expiresIn: "24h",
                    }
                  ),
                },
              });
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
