const jwt_decode = require("jwt-decode");
const Table = require("../../../models/Table.js");

module.exports = async function serviceCheckAccess(tableid, authHeader) {
  /*
  
  check that a a user belongs to a table (to act on it)
  
  parameters
  * table
  * userid
  
  */

  console.log("table.serviceCheckAccess");

  return new Promise((resolve, reject) => {
    // Get user id from header
    const token = authHeader && authHeader.split(" ")[1];
    const decodedtoken = jwt_decode(token);
    const userid = decodedtoken.id;

    // Find table
    Table.findOne({ _id: tableid })
      .then((table) => {
        console.log("userid " + userid);
        console.log(table);
        if (table !== undefined) {
          let userList = table.users.filter((user) => {
            return user._id === userid;
          });
          if (userList.length > 0) {
            resolve({
              outcome: true,
              reason: "table.ismember",
            });
          } else {
            resolve({
              outcome: false,
              reason: "table.notamember",
            });
          }
        } else {
          resolve({
            outcome: false,
            reason: "table.notfound",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        resolve({
          outcome: false,
          reason: "table.erroronfind",
        });
      });
  });
};
