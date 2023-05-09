const Game = require("../../models/Game.js");
const Table = require("../../models/Table.js");

module.exports = tableDelete = (req, res, next) => {
  /*
  
  deletes a table
  
  possible response types
  * table.delete.success
  * table.delete.error.deletinggames
  * table.delete.error.deletingtable
  
  TODO
  * only users from the table can do this
  
  */

  console.log("table.delete");

  // Initialize
  var status = 500;
  var type = "table.delete.error";

  // Delete table's games
  Game.deleteMany({ table: req.params.id }).catch((error) => {
    status = 400;
    type = "table.delete.error.deletinggames";
    res.status(status).json({
      type: type,
      message: "error on games delete",
      error: error,
    });
    console.error(error);
  });

  // Delete table
  Table.deleteOne({ _id: req.params.id })
    .then(() => {
      status = 200;
      type = "table.delete.success";
      res.status(status).json({
        type: type,
        message: "table deleted",
      });
    })
    .catch((error) => {
      status = 400;
      type = "table.delete.error.deletingtable";
      res.status(status).json({
        type: type,
        message: "error on table delete",
        error: error,
      });
      console.error(error);
    });
};
