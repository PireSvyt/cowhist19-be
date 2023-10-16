require("dotenv").config();
const Table = require("../../models/Table.js");

module.exports = tableCreate = (req, res, next) => {
  /*
  
  creates a table
  
  possible response types
  * table.create.success
  * table.create.error.oncreate
  * table.create.error.idprovided
  
  TODO
  * check user ids existance
  
  */

  if (process.env.DEBUG) {
    console.log("table.tableCreate");
  }

  // Prep
  delete req.body.tableid;

  // Save
  let tableToSave = { ...req.body };
  let tableUsers = [];
  tableToSave.users.forEach((user) => {
    if (user.status !== "guest") {
      tableUsers.push(user.userid);
    }
  });
  tableToSave.users = tableUsers;
  tableToSave = new Table(tableToSave);
  if (tableToSave.tableid === undefined) {
    tableToSave.tableid = tableToSave._id;
  }

  // Save
  tableToSave
    .save()
    .then(() => {
      console.log("table.create.success");
      return res.status(201).json({
        type: "table.create.success",
        data: {
          tableid: tableToSave._id,
        },
      });
    })
    .catch((error) => {
      console.log("table.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "table.create.error.oncreate",
        error: error,
        data: {
          tableid: null,
        },
      });
    });
};
