require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/

exports.signup = (req, res, next) => {
  console.log("user.signup " + req.body);

  // User existence check
  User.findOne({ login: req.body.login })
    .then((user) => {
      if (user) {
        return res.status(409).json({ message: "utilisateur déjà existant" });
      } else {
        // Password encryption
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            console.log("user.signup hash : " + hash);

            // User creation
            const user = new User({
              name: { ...req.body.name },
              login: { ...req.body.login },
              password: hash,
            });

            console.log("user.signup user : " + user);

            // User saving
            user
              .save()
              .then(res.status(201).json({ message: "ustilisateur créé" }))
              .catch((error) =>
                res
                  .status(400)
                  .json({ error, message: "erreur lors de la création" })
              );
          })
          .catch((error) =>
            res
              .status(500)
              .json({ error, message: "erreur lors de l'encryption" })
          );
      }
    })
    .catch((error) =>
      res
        .status(500)
        .json({ error, message: "erreur lors du check d'existance" })
    );
};

exports.login = (req, res, next) => {
  User.findOne({ login: req.body.login })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "utilisateur non trouvé" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "password incorrect" });
          }
          res.status(200).json({
            message: "user connecté",
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) =>
          res.status(500).json({ error, message: "erreur lors du compare" })
        );
    })
    .catch((error) =>
      res.status(500).json({ error, message: "erreur lors de la recherche" })
    );
};
