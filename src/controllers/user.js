const User = require("../models/User");

exports.invite = (req, res, next) => {
  return res.status(500).json({ message: "TODO user.invite" });
};

exports.close = (req, res, next) => {
  return res.status(500).json({ message: "TODO user.close" });
};

exports.anonymize = (req, res, next) => {
  return res.status(500).json({ message: "TODO user.anonymize" });
};

exports.changepw = (req, res, next) => {
  return res.status(500).json({ message: "TODO user.changepw" });
};

exports.changelogin = (req, res, next) => {
  return res.status(500).json({ message: "TODO user.changelogin" });
};

exports.merge = (req, res, next) => {
  return res.status(500).json({ message: "TODO user.merge" });
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
      // Retrieve tables' data
      user.tables.forEach((tableid) => {
        Table.findById(tableid)
          .then((table) => {
            tables[tableid] = table;
          })
          .catch((error) => {
            status = 400; // OK
            res.status(status).json({
              status: status,
              message: "error on find table by id",
              tables: [],
              error: error,
            });
            console.error(error);
          });
      });
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "user ok",
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
  return res.status(500).json({ message: "TODO user.stats" });
};

exports.details = (req, res, next) => {
  /*
  provides user details removing password
  */
  console.log("user.details");
  // Initialize
  var status = 500;
  User.findOne({ _id: req.params.id })
    .then((user) => {
      delete user.password;
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "user ok",
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
};
