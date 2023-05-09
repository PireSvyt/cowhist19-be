const Table = require("../../models/Table");

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

  // Initialize
  var status = 500;
  var type = "table.save.error";

  // Save
  if (req.body._id === "" || req.body._id === undefined) {
    console.log("table to create");

    // Prep
    delete req.body._id;
    let tableToSave = { ...req.body };
    let tableUsers = [];
    tableToSave.users.forEach((user) => {
      tableUsers.push(user._id);
    });
    tableToSave.users = tableUsers;
    console.log("table to save ");
    console.log(tableToSave);

    // Generate
    tableToSave = new Table(tableToSave);
    tableToSave.id = tableToSave._id;

    // Save
    tableToSave
      .save()
      .then(() => {
        console.log("table created");

        // Response
        status = 201;
        type = "table.save.success.created";
        res.status(status).json({
          type: type,
          message: "table created",
          data: {
            id: tableToSave._id,
          },
        });
      })
      .catch((error) => {
        console.log("error on create");
        status = 400;
        type = "table.save.error.oncreate";
        res.status(status).json({
          type: type,
          message: "error on create",
          error: error,
          data: {
            id: null,
          },
        });
      });
  } else {
    // Modify
    console.log("table to modify");
    console.log(req.body);
    let tableToSave = { ...req.body };

    // Prep
    let tableUsers = [];
    tableToSave.players.forEach((player) => {
      tableUsers.push(player._id);
    });
    tableToSave.users = tableUsers;
    console.log("table to save ");
    console.log(tableToSave);

    // Manage table to users
    Table.findOne({ _id: tableToSave._id })
      .then((table) => {
        console.log("found table " + table._id);
        console.log(table);

        // Save
        Table.updateOne({ _id: tableToSave._id }, tableToSave)
          .then(() => {
            console.log("table modified");
            status = 200;
            type = "table.save.success.modified";
            res.status(status).json({
              type: type,
              message: "table modified",
              data: {
                id: tableToSave._id,
              },
            });
          })
          .catch((error) => {
            console.log("error on modified");
            status = 400;
            type = "table.save.error.onmodify";
            res.status(status).json({
              type: type,
              message: "error on modify",
              error: error,
              data: {
                id: null,
              },
            });
            console.error(error);
          });
      })
      .catch((error) => {
        console.log("error on user update");
        status = 400;
        type = "table.save.error.onfindtable";
        res.status(status).json({
          type: type,
          message: "error on find table",
          error: error,
          data: {
            id: null,
          },
        });
        console.error(error);
      });
  }
};
