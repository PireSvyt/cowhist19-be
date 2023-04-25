const Table = require("../models/Table");

exports.save = (req, res, next) => {
  return res.status(500).json({ message: "TODO table.save" });
};

exports.delete = (req, res, next) => {
  // TODO : remove the table from users
  // TODO : delete games
  console.log("table.delete");
  // Initialize
  var status = 500;
  Table.deleteOne({ _id: req.params.id })
    .then(() => {
      status = 200;
      res.status(status).json({
        status: status,
        message: "table deleted",
      });
    })
    .catch((error) => {
      status = 400;
      res.status(status).json({
        status: status,
        message: "error on find",
        error: error,
        table: req.body,
      });
      console.error(error);
    });
};

exports.details = (req, res, next) => {
  return res.status(500).json({ message: "TODO table.details" });
};

exports.stats = (req, res, next) => {
  return res.status(500).json({ message: "TODO table.stats" });
};

exports.history = (req, res, next) => {
  return res.status(500).json({ message: "TODO table.history" });
};
