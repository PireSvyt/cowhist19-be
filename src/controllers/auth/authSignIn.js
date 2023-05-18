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
        let attemptPassword = eq.body.password;
        // Password decrypt
        if (req.body.encryption === true) {
          console.log("password decryption");
          console.log(req.body.password);
          var decrypted = CryptoJS.AES.decrypt(
            "U2FsdGVkX18NmX6i458Xec/+OhFDnref7Y7pKe6Iu6s=",
            process.env.ENCRYPTION_KEY.toString()
          );
          console.log(decrypted);
          var attemptPassword = decrypted.toString(CryptoJS.enc.Utf8);
          console.log(attemptPassword);
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
