const jwt_decode = require("jwt-decode");
const User = require("../../../models/User.js");

module.exports = async function serviceCheckAdmin(authHeader) {
  /*
  
  check that a a user is admin
  
  */

  console.log("admin.serviceCheckAdmin");

  return new Promise((resolve, reject) => {
    // Get user id from header
    const token = authHeader && authHeader.split(" ")[1];
    const decodedtoken = jwt_decode(token);
    const userid = decodedtoken.id;

    // Find table
    User.findOne({ _id: userid })
      .then((user) => {
        if (user !== undefined) {
          if (user.priviledges.includes("admin")) {
            resolve({
              outcome: true,
              reason: "admin.isadmin",
            });
          } else {
            resolve({
              outcome: false,
              reason: "admin.isnotadmin",
            });
          }
        } else {
          resolve({
            outcome: false,
            reason: "admin.notfound",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        resolve({
          outcome: false,
          reason: "admin.erroronfind",
        });
      });
  });
};
