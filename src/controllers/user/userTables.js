const Table = require("../../models/Table.js");

module.exports = userTables = (req, res, next) => {
  /*
  
  provides a dict of tables user belongs to  
  
  possible response types
  * user.tables.success
  * user.tables.error.onfind
  
  */

  console.log("user.tables");

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  Table.find({ users: decodedToken.id }, "name")
    .then((tables) => {
      res.status(200).json({
        type: "user.tables.success",
        message: "tables ok",
        data: {
          tables: tables,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        type: "user.tables.error.onfind",
        message: "error on find",
        error: error,
        data: {
          tables: [],
        },
      });
      console.error(error);
    });
};
