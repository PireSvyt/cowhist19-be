const Table = require("../../models/Table.js");

module.exports = tableSave = (req, res, next) => {
  /*
  
  saves a table
  
  possible response types
  * table.save.error.emptyid
  * table.save.error.oncreate
  * table.save.success.modified
  
  TODO
  * check user ids existance
  * only users from the table can do this
  
  */

  console.log("table.tableSave");

  // Save
  if (req.body._id === "" || req.body._id === undefined) {
    res.status(403).json({
      type: "table.save.success.emptyid",
      data: {
        id: null,
      },
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
};
