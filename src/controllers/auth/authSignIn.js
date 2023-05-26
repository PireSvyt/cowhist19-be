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

  User.findOne(
    { login: req.body.login },
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
          console.log("password decryption");
          console.log(req.body.encryptions);

          console.log(
            "encryption.passwordTostring.processenvTostring.encryptionTostring"
          );
          console.log(
            CryptoJS.AES.decrypt(
              req.body.encryptions.passwordTostring.processenvTostring
                .encryptionTostring,
              process.env.ENCRYPTION_KEY
            )
          );

          console.log(
            "encryption.passwordTostring.processenvAsis.encryptionTostring"
          );
          console.log(
            CryptoJS.AES.decrypt(
              req.body.encryptions.passwordTostring.processenvAsis
                .encryptionTostring,
              process.env.ENCRYPTION_KEY
            )
          );

          console.log(
            "encryption.passwordAsis.processenvTostring.encryptionTostring"
          );
          console.log(
            CryptoJS.AES.decrypt(
              req.body.encryptions.passwordAsis.processenvTostring
                .encryptionTostring,
              process.env.ENCRYPTION_KEY
            )
          );

          console.log(
            "encryption.passwordAsis.processenvAsis.encryptionTostring"
          );
          console.log(
            CryptoJS.AES.decrypt(
              req.body.encryptions.passwordAsis.processenvAsis
                .encryptionTostring,
              process.env.ENCRYPTION_KEY
            )
          );

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
                return res.status(200).json({
                  type: "auth.signin.success",
                  data: {
                    id: user._id,
                    token: jwt.sign(
                      {
                        status: user.status,
                        id: user._id,
                        pseudo: user.pseudo,
                        login: req.body.login,
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
