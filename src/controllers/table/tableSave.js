const Table = require("../../models/Table.js");
const tableCreate = require("./tableCreate.js");

module.exports = tableSave = (req, res, next) => {
  /*
  
  saves a table
  
  possible response types
  * table.save.error.emptyid
  * table.save.success.modified
  * table.save.error.onfindtable
  * table.save.error.onmodify
  
  TODO
  * check user ids existance
  * only users from the table can do this
  
  */

  console.log("table.save");

  // Save
  if (req.body._id === "" || req.body._id === undefined) {
    console.log("table.save.error.emptyid");
    return res.status(503).json({
      type: "table.save.error.emptyid",
      error: error,
    });
  } else {
    // Modify
    let tableToSave = { ...req.body };

    // Packaging for saving
    let tableUsers = [];
    tableToSave.users.forEach((user) => {
      let userToAdd = true;
      if (user.status !== undefined) {
        if (user.status === "guest") {
          userToAdd = false;
        }
      }
      if (userToAdd) {
        tableUsers.push(user._id);
      }
    });
    tableToSave.users = tableUsers;

    // Manage table to users
    Table.findOne({ _id: tableToSave._id })
      .then(() => {
        // Save
        Table.updateOne({ _id: tableToSave._id }, tableToSave)
          .then(() => {
            console.log("table.save.success.modified");
            return res.status(200).json({
              type: "table.save.success.modified",
              data: {
                id: tableToSave._id,
              },
            });
          })
          .catch((error) => {
            console.log("table.save.error.onmodify");
            console.error(error);
            return res.status(400).json({
              type: "table.save.error.onmodify",
              error: error,
            });
          });
      })
      .catch((error) => {
        console.log("table.save.error.onfindtable");
        console.error(error);
        return res.status(400).json({
          type: "table.save.error.onfindtable",
          error: error,
        });
      });
  }
};
