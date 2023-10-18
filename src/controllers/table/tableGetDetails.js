require("dotenv").config();
const Table = require("../../models/Table.js");
const contracts = require("../../resources/contracts.json");
const { random_id } = require("../../resources/toolkit");

module.exports = tableGetDetails = (req, res, next) => {
  /*
  
  provides the details of a table
  
  possible response types
  * table.getdetails.success
  * table.getdetails.error.onaggregate
  
  TODO
  * only users from the table can do this
  
  */

  if (process.env.DEBUG) {
    console.log("table.getdetails");
  }

  Table.aggregate([
    {
      $match: {
        tableid: req.params.id,
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "userid",
        localField: "userids",
        as: "players",
        pipeline: [
          {
            $project: {
              userid: 1,
              pseudo: 1,
              status: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        tableid: 1,
        name: 1,
        guests: 1,
        userids: 1,
        players: 1,
      },
    },
  ])
    .then((tables) => {
      console.log("tables", tables);
      if (tables.length === 1) {
        let table = tables[0];
        // Add guest players
        for (var guest = 1; guest <= table.guests; guest++) {
          table.players.push({
            userid: random_id(),
            status: "guest",
          });
        }
        // Add contracts
        table.contracts = contracts;
        // Response
        console.log("table.getdetails.success");
        return res.status(200).json({
          type: "table.getdetails.success",
          data: {
            table: table,
          },
        });
      } else {
        console.log("table.getdetails.error.onfind");
        return res.status(400).json({
          type: "table.getdetails.error.onfind",
          data: {
            table: {},
          },
        });
      }
    })
    .catch((error) => {
      console.log("table.getdetails.error.onaggregate");
      console.log(error);
      return res.status(400).json({
        type: "table.getdetails.error.onaggregate",
        data: {
          table: {},
        },
        error: error,
      });
    });
};
