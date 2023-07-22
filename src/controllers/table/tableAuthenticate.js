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

  console.log("table.authenticate");

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Prep
  let tableid = req.params.id;
  if (!tableid) {
    tableid = req.body.id;
  }

  Table.findOne({ _id: tableid })
    .then((table) => {
      if (table !== undefined) {
        if (table.users.includes(decodedToken.id)) {
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
