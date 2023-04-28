const User = require("../models/User");

exports.invite = (req, res, next) => {
  /*
  create invited user if not yet existing
  */
  console.log("user.invite");
  let status = 500;
  // User existence check
  User.findOne({ login: req.body.login })
    .then((user) => {
      if (user) {
        status = 202;
        return res.status(status).json({
          status: status,
          message: "utilisateur déjà existant",
        });
      } else {
        // User creation
        let name = req.body.login.split("@")[0];
        const user = new User({
          name: name,
          login: req.body.login,
          password: "NONE SO FAR",
          status: "invited",
        });
        // Saving
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
};

exports.close = (req, res, next) => {
  return res.status(500).json({ status: 500, message: "TODO user.close" });
};

exports.anonymize = (req, res, next) => {
  return res.status(500).json({ status: 500, message: "TODO user.anonymize" });
};

exports.changepw = (req, res, next) => {
  return res.status(500).json({ status: 500, message: "TODO user.changepw" });
};

exports.changelogin = (req, res, next) => {
  return res
    .status(500)
    .json({ status: 500, message: "TODO user.changelogin" });
};

exports.merge = (req, res, next) => {
  return res.status(500).json({ status: 500, message: "TODO user.merge" });
};

exports.tables = (req, res, next) => {
  /*
  provides a dict of tables user belongs to  
  */
  console.log("user.tables");
  // Initialize
  var status = 500;
  var tables = {};
  User.findOne({ _id: req.params.id })
    .then((user) => {
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "user ok",
        tables: user.tables,
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        tables: [],
        error: error,
      });
      console.error(error);
    });
};

exports.stats = (req, res, next) => {
  return res.status(500).json({ status: 500, message: "TODO user.stats" });
};

exports.details = (req, res, next) => {
  /*
  provides user details 
  
  removes 
  * password
  
  */
  console.log("user.details");
  // Initialize
  var status = 500;
  var message = "";
  User.findOne({ _id: req.params.id })
    .then((user) => {
      // Prep
      let tempuser = {};
      tempuser.name = user.name;
      tempuser.tables = user.tables;
      tempuser.status = user.status;
      console.log("tempuser " + tempuser);
      // Send
      status = 200;
      res.status(status).json({
        status: status,
        message: message,
        user: tempuser,
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        user: {},
        error: error,
      });
      console.error(error);
    });
};
