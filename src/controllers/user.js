const jwt_decode = require('jwt-decode');
const User = require("../models/User");
const Table = require("../models/Table");

exports.invite = (req, res, next) => {
  /*
  create invited user if not yet existing
  */
  console.log("user.invite");
  let status = 500;
  // User existence check
  User.findOne({ login: req.body.login }, "pseudo status")
    .then((user) => {
      if (user) {
        status = 202;
        return res.status(status).json({
          status: status,
          user: user,
          message: "utilisateur déjà existant",
        });
      } else {
        // User creation
        let user = new User({
          pseudo: req.body.pseudo,
          login: req.body.login,
          password: "NONE SO FAR",
          status: "invited",
        });
        user.id = user._id;
        // Saving
        user
          .save()
          .then(() => {
            status = 201;
            res.status(status).json({
              status: status,
              user: { 
                _id: user._id, 
                pseudo: user.pseudo, 
                status: user.status 
              },
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

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  Table.find({ users: decodedToken.id }, "name")
    .then((tables) => {
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "tables ok",
        tables: tables,
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

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.aggregate([
    { $match: { 
        id: decodedToken.id
    } },
    { $lookup: { 
        from: 'tables',
        foreignField: 'users', 
        localField: 'id', 
        as: 'tables',
        pipeline: [
          { $project: {
            _id: 1, 
            name: 1, 
          } }
        ]
    } },
    { $project: {
      _id: 1, 
      pseudo: 1, 
      login: 1, 
      status: 1, 
      priviledges: 1, 
      tables: 1, 
    } }
  ])
  .then((user) => {
    if (user.length === 1) {
      // Response
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "user ok",
        user: user[0],
      });
    } else {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on user find",
        user: {},
      });
    }
  })
  .catch((error) => {
    status = 400; // OK
    console.error(error);
    res.status(status).json({
      status: status,
      message: "error on aggregate",
      user: {},
      error: error,
    });
  });

/*
  User.findOne({ _id: decodedToken.id }, "pseudo login status priviledges")
    .then((user) => {
      // Send
      status = 200;
      res.status(status).json({
        status: status,
        message: message,
        user: user,
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
    */
};
