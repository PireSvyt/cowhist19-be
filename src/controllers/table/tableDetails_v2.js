require("dotenv").config();
const Table = require("../../models/Table.js");
const contracts = require("../../resources/contracts.json");
const { random_id } = require("../../resources/toolkit");

module.exports = tableDetails_v2 = (req, res, next) => {
  /*
  
  provides the details of a table
  
  possible response types
  * table.details.success
  * table.details.error.onaggregate
  * table.details.error.onfind
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("table.details");
  }

  Table.aggregate([
    {
      $match: {
        id: req.params.id,
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "id",
        localField: "users",
        as: "players",
        pipeline: [
          {
            $project: {
              _id: 1,
              pseudo: 1,
              status: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        guests: 1,
        players: 1,
      },
    },
  ])
    .then((tables) => {
      if (tables.length === 1) {
        let table = tables[0];
        // Add guest players
        for (var guest = 1; guest <= table.guests; guest++) {
          table.players.push({
            _id: random_id(),
            status: "guest",
          });
        }
        // Add contracts
        table.contracts = contracts;
        // Response
        console.log("table.details.success");
        return res.status(200).json({
          type: "table.details.success",
          data: {
            table: table,
          },
        });
      } else {
        console.log("table.details.error.onfind");
        return res.status(400).json({
          type: "table.details.error.onfind",
          data: {
            table: {},
          },
        });
      }
    })
    .catch((error) => {
      console.log("table.details.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "table.details.error.onaggregate",
        data: {
          table: {},
        },
        error: error,
      });
    });
};
