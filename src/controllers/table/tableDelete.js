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
  Game.deleteMany({ tableid: req.params.tableid }).catch((error) => {
    console.log("table.delete.error.ondeletegames");
    console.error(error);
    return res.status(400).json({
      type: "table.delete.error.ondeletegames",
      error: error,
    });
  });

  // Delete table
  Table.deleteOne({ tableid: req.params.id })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("table.delete.success");
        return res.status(200).json({
          type: "table.delete.success",
          data: deleteOutcome,
        });
      } else {
        console.log("table.delete.error.outcome");
        return res.status(400).json({
          type: "table.delete.error.outcome",
          data: deleteOutcome,
        });
      }
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
