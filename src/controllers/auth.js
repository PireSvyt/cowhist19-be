const User = require("../models/User");
const bcrypt = require("bcrypt");
// BCRYPT https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
const jwt = require("jsonwebtoken");

var toolkit = require("./auth/services/toolkit.js");

module.exports = {
  signup: signup,
  activate: activate,
  login: login,
  assess: assess,
  authenticate: authenticate,
  belongstotable: belongstotable,
  isadminuser: isadminuser,
  requesttoken: requesttoken,
  resetpw: resetpw,
};
/*
async function signup(req, res, next) {
  let status = 500;

  try {
    let user = await User.findOne({ login: req.body.login });
    if (user) {
      // Invited
      if (user.status === "invited") {
        let hash = await bcrypt.hash(req.body.password, 10);
        // User edit
        user.pseudo = req.body.pseudo;
        user.password = hash;
        user.status = "signedup";
        user.activationtoken = toolkit.random_string(20);
        // User saving
        let savingoutcome = await user.save();
        status = 200;
        res.status(status).json({
          status: status,
          id: user._id,
          message: "ustilisateur enregistré",
        });
        return;
      } else {
        status = 202;
        res.status(status).json({
          status: status,
          id: user._id,
          message: "ustilisateur not invited",
        });
        return;
      }
    } else {
      status = 203;
      res.status(status).json({
        status: status,
        id: user._id,
        message: "ustilisateur not found",
      });
      return;
    }
  } catch (err) {
    status = 400;
    res.status(status).json({
      status: status,
      error,
      message: "erreur in low try",
    });
    return;
  }
}
*/

async function signup(req, res, next) {
  console.log("auth.signup");
  let status = 500;
  User.findOne({ login: req.body.login })
    .then((user) => {
      if (user) {
        console.log("user to signup from invited");
        // Invited
        if (user.status === "invited") {
          bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
              console.log(hash);
              // User edit
              user.pseudo = req.body.pseudo;
              user.password = hash;
              user.status = "signedup";
              user.activationtoken = toolkit.random_string(20);
              // User saving
              user
                .save()
                .then(() => {
                  status = 200;
                  res.status(status).json({
                    status: status,
                    id: user._id,
                    message: "ustilisateur enregistré",
                  });
                })
                .catch((error) => {
                  status = 400;
                  res.status(status).json({
                    status: status,
                    error,
                    message: "erreur lors de la création",
                  });
                });
            })
            .catch((error) => {
              status = 500;
              res.status(status).json({
                status: status,
                error,
                message: "erreur lors de l'encryption on create",
              });
            });
        } else {
          // Already existing
          status = 409;
          return res
            .status(status)
            .json({ status: status, message: "utilisateur déjà existant" });
        }
      } else {
        console.log("user to signup from scratch");
        // Password encryption
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            console.log(hash);
            // User creation
            var user = new User({
              id: "dummy id",
              pseudo: req.body.pseudo,
              login: req.body.login,
              password: hash,
              status: "signedup",
              activationtoken: toolkit.random_string(20),
            });
            user.id = user._id;
            // User saving
            user
              .save()
              .then(() => {
                status = 201;
                res.status(status).json({
                  status: status,
                  id: user._id,
                  message: "ustilisateur créé",
                });
              })
              .catch((error) => {
                status = 400;
                res.status(status).json({
                  status: status,
                  error,
                  message: "erreur lors de la création",
                });
              });
          })
          .catch((error) => {
            status = 500;
            res.status(status).json({
              status: status,
              error,
              message: "erreur lors de l'encryption on modify",
            });
          });
      }
    })
    .catch((error) => {
      status = 500;
      res.status(status).json({
        status: status,
        error,
        message: "erreur lors du check d'existance",
      });
    });
}

function activate(req, res, next) {
  console.log("auth.activate");
  let status = 500;
  User.findOne({ activationtoken: req.params.id })
    .then((user) => {
      if (user !== undefined) {
        // Signedup check
        if (user.status === "signedup") {
          user.status = "activated";
          // User saving
          user
            .save()
            .then(() => {
              status = 200;
              res.status(status).json({
                status: status,
                id: user._id,
                message: "ustilisateur activé",
                outcome: "activated",
              });
            })
            .catch((error) => {
              status = 400;
              res.status(status).json({
                status: status,
                error,
                message: "erreur lors du save",
                outcome: "error",
              });
            });
        } else {
          if (user.status === "activated") {
            status = 200;
            res.status(status).json({
              status: status,
              id: user._id,
              message: "ustilisateur déjà activé",
              outcome: "activated",
            });
          } else {
            status = 202;
            return res.status(status).json({
              status: status,
              message: "token non trouvé",
              outcome: "notfound",
            });
          }
        }
      } else {
        status = 202;
        return res.status(status).json({
          status: status,
          message: "token non trouvé",
          outcome: "notfound",
        });
      }
    })
    .catch((error) => {
      status = 500;
      res.status(status).json({
        status: status,
        error,
        message: "erreur lors du check d'existance",
        outcome: "error",
      });
    });
}

function login(req, res, next) {
  console.log("auth.login");
  let status = 500;
  User.findOne(
    { login: req.body.login },
    "pseudo login status priviledges password"
  )
    .then((user) => {
      if (!user) {
        status = 404;
        return res
          .status(status)
          .json({ status: status, message: "utilisateur non trouvé" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            status = 401;
            return res
              .status(status)
              .json({ status: status, message: "password incorrect" });
          }
          status = 200;
          res.status(status).json({
            status: status,
            message: "user connecté",
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
          });
        })
        .catch((error) => {
          status = 500;
          res
            .status(status)
            .json({ status: status, error, message: "erreur lors du compare" });
        });
    })
    .catch((error) => {
      status = 500;
      res.status(status).json({
        status: status,
        error,
        message: "erreur lors de la recherche",
      });
    });
}

function assess(req, res, next) {
  console.log("auth.assess");
  console.log("req.body.token");
  console.log(req.body.token);
  let status = 500;
  // Assess
  if (req.body.token === null || req.body.token === undefined) {
    status = 401;
    return res.status(status).json({
      status: status,
      token: req.body.token,
      message: "Invalid token",
    });
  } else {
    jwt.verify(req.body.token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        status = 404;
        return res.status(status).json({
          status: status,
          message: "Unauthorized",
          error: err,
        });
      }
      // Token is valid
      status = 200;
      return res.status(status).json({
        status: status,
        message: "Valid token",
        user: user,
      });
    });
  }
}

function authenticate(req, res, next) {
  console.log("auth.authenticate");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  let status = 500;
  if (token === null) {
    status = 401;
    return res
      .status(status)
      .json({ status: status, message: "Invalid token" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        status = 401;
        return res.status(status).json({ status: status, message: err });
      }
      req.user = user;
      next();
    });
  }
}

function belongstotable(req, res, next) {
  return res
    .status(500)
    .json({ status: 500, message: "TODO auth.belongstotable" });
}

function isadminuser(req, res, next) {
  return res
    .status(500)
    .json({ status: 500, message: "TODO auth.isadminuser" });
}

function requesttoken(req, res, next) {
  return res
    .status(500)
    .json({ status: 500, message: "TODO auth.requesttoken" });
}

function resetpw(req, res, next) {
  return res.status(500).json({ status: 500, message: "TODO auth.resetpw" });
}
