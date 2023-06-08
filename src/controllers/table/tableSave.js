const Table = require("../../models/Table.js");
const serviceCheckAccess = require("./services/serviceCheckAccess.js");
const serviceTableCreate = require("./services/serviceTableCreate.js");

module.exports = tableSave = (req, res, next) => {
  /*
  
  saves a table
  
  possible response types
  * table.save.success.created
  * table.save.error.oncreate
  * table.save.success.modified
  
  TODO
  * check user ids existance
  * only users from the table can do this
  
  */

  console.log("table.tableSave");

  // Save
  if (req.body._id === "" || req.body._id === undefined) {
    // Prep
    delete req.body._id;

    // Save
    let tableToSave = { ...req.body };
    let tableUsers = [];
    tableToSave.users.forEach((user) => {
      tableUsers.push(user._id);
    });
    tableToSave.users = tableUsers;
    tableToSave = new Table(tableToSave);
    tableToSave.id = tableToSave._id;

    // Save
    tableToSave
      .save()
      .then(() => {
        if (process.env.NODE_ENV !== "_production") {
          console.log("table.serviceTableCreate success");
        }
        res.status(201).json({
          type: "table.save.success.created",
          data: {
            id: tableToSave._id,
          },
        });
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "_production") {
          console.log("table.serviceTableCreate error");
        }
        console.log(error);
        res.status(400).json({
          type: "table.save.error.oncreate",
          error: error,
          data: {
            id: null,
          },
        });
      });
  } else {
    // Modify

    // Check access
    serviceCheckAccess(req.body._id, req.headers["authorization"]).then(
      (access) => {
        if (!access.outcome) {
          // Unauthorized
          res.status(401).json({
            type: "table.delete.error.deniedaccess",
            error: access.reason,
          });
        } else {
          let tableToSave = { ...req.body };
          let tableUsers = [];
          tableToSave.players.forEach((player) => {
            tableUsers.push(player._id);
          });
          tableToSave.users = tableUsers;

          // Manage table to users
          Table.findOne({ _id: tableToSave._id })
            .then(() => {
              // Save
              Table.updateOne({ _id: tableToSave._id }, tableToSave)
                .then(() => {
                  res.status(200).json({
                    type: "table.save.success.modified",
                    data: {
                      id: tableToSave._id,
                    },
                  });
                })
                .catch((error) => {
                  res.status(400).json({
                    type: "table.save.error.onmodify",
                    error: error,
                    data: {
                      id: null,
                    },
                  });
                  console.error(error);
                });
            })
            .catch((error) => {
              res.status(400).json({
                type: "table.save.error.onfindtable",
                error: error,
                data: {
                  id: null,
                },
              });
              console.error(error);
            });
        }
      }
    );
  }
};
