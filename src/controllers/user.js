const User = require("../models/User");
const Table = require("../models/Table");

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
      const getTablesRes = getTables(user);
      if (getTablesRes.status === 200) {
        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "user ok",
          tables: getTablesRes.tables,
        });
      } else {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on find tables",
          tables: {},
          error: error,
        });
      }
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
      let tempuser = user;
      delete tempuser["password"];
      console.log("user " + user);
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
