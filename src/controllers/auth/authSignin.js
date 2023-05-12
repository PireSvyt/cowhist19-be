const bcrypt = require("bcrypt");
// BCRYPT https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/

const User = require("../../models/User.js");

module.exports = authSignin = (req, res, next) => {
  /*
  
  sign in a user
  sends back a jwt token
  
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
        return res.status(404).json({
          type: "auth.signin.error.notfound",
          message: "utilisateur non trouvé",
          data: {
            id: "",
            token: "",
          },
        });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({
                type: "auth.signin.error.invalidpassword",
                message: "password incorrect",
                data: {
                  id: "",
                  token: "",
                },
              });
            } else {
              return res.status(200).json({
                type: "auth.signin.success",
                message: "user connecté",
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
            return res.status(500).json({
              type: "auth.signin.error.onpasswordcompare",
              error,
              message: "erreur lors du compare",
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
        error,
        data: {
          id: "",
          token: "",
        },
      });
    });
};
