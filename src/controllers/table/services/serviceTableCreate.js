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
      tableToSave = new Table(tableToSave);
      tableToSave._id = tableToSave.id;
    }
    console.log(tableToSave);

    // Save
    tableToSave
      .save()
      .then(() => {
        if (process.env.NODE_ENV !== "_production") {
          console.log("table.serviceTableCreate success");
        }
        resolve({
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
