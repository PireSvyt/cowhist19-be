require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Table = require("../../models/Table.js");

module.exports = tableAuthenticate = (req, res, next) => {
  /*
  
  authenticate the user as part of the table
  
  possible response types
  * table.authenticate.error.notamember
  * table.authenticate.error.notfound
  * table.authenticate.error.erroronfind
  
  */

  if (process.env.DEBUG) {
    console.log("table.authenticate");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Prep
  let tableid = req.params.id;
  if (!tableid) {
    tableid = req.body.tableid;
  }

  console.log("tableid", tableid);

  Table.findOne({ tableid: tableid })
    .then((table) => {
      if (table !== null) {
        if (table.users.includes(decodedToken.userid)) {
          next();
        } else {
          console.log("table.authenticate.error.notamember");
          return res.status(403).json({
            type: "table.authenticate.error.notamember",
          });
        }
      } else {
        console.log("table.authenticate.error.notfound");
        return res.status(403).json({
          type: "table.authenticate.error.notfound",
        });
      }
    })
    .catch((error) => {
      console.log("table.authenticate.error.erroronfind");
      console.error(error);
      return res.status(403).json({
        type: "table.authenticate.error.erroronfind",
      });
    });
};
