const Table = require("../../../models/Table.js");

module.exports = async function serviceTableDelete(tableid) {
  /*
  
  deletes a table
  
  parameters
  * tableid
  
  */

  console.log("table.serviceTableDelete");

  return new Promise((resolve, reject) => {
    Table.deleteOne({ _id: tableid })
      .then(() => {
        resolve({
          type: "table.delete.success",
        });
      })
      .catch((error) => {
        console.error(error);
        resolve({
          type: "table.delete.error.ondeletetable",
          error: error,
        });
      });
  });
};
