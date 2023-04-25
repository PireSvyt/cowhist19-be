require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  console.log(
    "user.signup " +
      req.body.name +
      " " +
      req.body.login +
      " " +
      req.body.password
  );

  bcrypt
    .hash(req.body.password, process.env.BCRYPT_KEY)
    .then((hash) => {
      const user = new User({
        login: req.body.login,
        password: hash,
      });
      user
        .save()
        .then(res.status(201).json({ message: "ustilisateur créé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ login: req.body.login })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "utilisateur non trouvé" });
      }
      bcrypt
        .compare()
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
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
