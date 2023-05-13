const Table = require("../../models/Table.js");
const contracts = require("./resources/contracts.json");

module.exports = tableDetails = (req, res, next) => {
  /*
  
  provides the details of a table
  
  possible response types
  * table.details.success
  * table.details.error.onaggregate
  * table.details.error.onfind
  
  TODO
  * only users from the table can do this
  
  */

  console.log("table.details");

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
        players: 1,
      },
    },
  ])
    .then((tables) => {
      if (tables.length === 1) {
        let table = tables[0];
        table.contracts = contracts;
        // Response
        res.status(200).json({
          type: "table.details.success",
          data: {
            table: table,
          },
        });
      } else {
        res.status(400).json({
          type: "table.details.error.onfind",
          data: {
            table: {},
          },
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        type: "table.details.error.onaggregate",
        data: {
          table: {},
        },
        error: error,
      });
      console.error(error);
    });
};
