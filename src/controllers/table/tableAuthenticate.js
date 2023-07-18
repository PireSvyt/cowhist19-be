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

  Table.findOne({ _id: req.params.id })
    .then((table) => {
      if (table !== undefined) {
        if (table.users.includes(decodedToken.id)) {
          req.user = user;
          next();
        } else {
          return res.status(403).json({
            type: "table.authenticate.error.notamember",
          });
        }
      } else {
        return res.status(403).json({
          type: "table.authenticate.error.notfound",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(403).json({
        type: "table.authenticate.error.erroronfind",
      });
    });
};
