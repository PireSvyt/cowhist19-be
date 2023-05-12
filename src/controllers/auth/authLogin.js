const User = require("../../models/User.js");

module.exports = authLogin = (req, res, next) => {
  /*
  
  login a user
  sends back a jwt token
  
  possible response types
  * auth.login.success
  * auth.login.error.notfound
  * auth.login.error.onfind
  * auth.login.error.invalidpassword
  * auth.login.error.onpasswordcompare
  
  */

  console.log("auth.login");

  User.findOne(
    { login: req.body.login },
    "pseudo login status priviledges password"
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          type: "auth.login.error.notfound",
          message: "utilisateur non trouvé",
          data: {
            id: "",
            token: "",
          },
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              type: "auth.login.error.invalidpassword",
              message: "password incorrect",
              data: {
                id: "",
                token: "",
              },
            });
          }
          res.status(200).json({
            type: "auth.login.success",
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
        })
        .catch((error) => {
          res.status(500).json({
            type: "auth.login.error.onpasswordcompare",
            error,
            message: "erreur lors du compare",
            data: {
              id: "",
              token: "",
            },
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        type: "auth.login.error.onfind",
        error,
        message: "erreur lors de la recherche",
        data: {
          id: "",
          token: "",
        },
      });
    });
};
