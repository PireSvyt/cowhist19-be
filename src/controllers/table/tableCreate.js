const Table = require("../../models/Table.js");

module.exports = tableCreate = (req, res, next) => {
  /*
  
  creates a table
  
  possible response types
  * table.create.success.created
  * table.create.error.oncreate
  * table.create.error.idprovided
  
  TODO
  * check user ids existance
  
  */

  console.log("table.tableCreate");

  // Save
  if (req.body._id === "" || req.body._id === undefined) {
    // Prep
    delete req.body._id;

    // Save
    let tableToSave = { ...req.body };
    let tableUsers = [];
    tableToSave.users.forEach((user) => {
      if (user.status !== "guest") {
        tableUsers.push(user._id);
      }
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
          type: "table.create.success.created",
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
          type: "table.create.error.oncreate",
          error: error,
          data: {
            id: null,
          },
        });
      });
  } else {
    res.status(403).json({
      type: "table.create.error.idprovided",
      data: {
        id: null,
      },
    });
  }
};
