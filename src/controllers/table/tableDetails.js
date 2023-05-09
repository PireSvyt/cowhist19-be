const Table = require("../../models/Table.js");

const contracts = require("../../ressources/contracts.json");

module.exports = details = (req, res, next) => {
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

  // Initialize
  var status = 500;
  var type = "table.details.error";

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
        status = 200;
        type = "table.details.success";
        res.status(status).json({
          type: type,
          message: "table ok",
          data: {
            table: table,
          },
        });
      } else {
        status = 400;
        type = "table.details.error.onfind";
        res.status(status).json({
          type: type,
          message: "error on find",
          data: {
            table: {},
          },
        });
      }
    })
    .catch((error) => {
      status = 400;
      type = "table.details.error.onaggregate";
      console.error(error);
      res.status(status).json({
        type: type,
        message: "error on aggregate",
        data: {
          table: {},
        },
        error: error,
      });
    });
};
