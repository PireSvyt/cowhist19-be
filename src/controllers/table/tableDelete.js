require("dotenv").config();
const Game = require("../../models/Game.js");
const Table = require("../../models/Table.js");

module.exports = tableDelete = (req, res, next) => {
  /*
  
  deletes a table
  
  possible response types
  * table.delete.success
  * table.delete.error.ondeletegames
  * table.delete.error.ondeletetable
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("table.delete");
  }

  // Delete table's games
  Game.deleteMany({ table: req.params.id }).catch((error) => {
    console.log("table.delete.error.ondeletegames");
    console.error(error);
    return res.status(400).json({
      type: "table.delete.error.ondeletegames",
      error: error,
    });
  });

  // Delete table
  Table.deleteOne({ _id: req.params.id })
    .then(() => {
      console.log("table.delete.success");
      return res.status(200).json({
        type: "table.delete.success",
      });
    })
    .catch((error) => {
      console.log("table.delete.error.ondeletetable");
      console.error(error);
      return res.status(400).json({
        type: "table.delete.error.ondeletetable",
        error: error,
      });
    });
};
