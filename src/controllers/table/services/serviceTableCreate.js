const Table = require("../../../models/Table.js");

module.exports = async function serviceTableCreate(tableToSave) {
  /*
  
  deletes a table
  
  parameters
  * tableid
  
  */

  console.log("table.serviceTableCreate");

  return new Promise((resolve, reject) => {
    let tableUsers = [];
    tableToSave.users.forEach((user) => {
      tableUsers.push(user._id);
    });
    tableToSave.users = tableUsers;

    // Generate
    if (tableToSave.id === undefined) {
      tableToSave = new Table(tableToSave);
      tableToSave.id = tableToSave._id;
    } else {
      // Mocking data
      tableToSave._id = tableToSave.id;
      tableToSave = new Table(tableToSave);
    }

    // Save
    tableToSave
      .save()
      .then(() => {
        resolve({
          type: "table.save.success.created",
          data: {
            id: tableToSave._id,
          },
        });
      })
      .catch((error) => {
        resolve({
          type: "table.save.error.oncreate",
          error: error,
          data: {
            id: null,
          },
        });
      });
  });
};
