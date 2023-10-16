require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Table = require("../../models/Table.js");

module.exports = userTables = (req, res, next) => {
  /*
  
  provides a dict of tables user belongs to  
  
  possible response types
  * user.tables.success
  * user.tables.error.onfind
  
  */

  if (process.env.DEBUG) {
    console.log("user.tables");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  Table.find({ users: decodedToken.userid }, "name")
    .then((tables) => {
      console.log("user.tables.success");
      return res.status(200).json({
        type: "user.tables.success",
        data: {
          tables: tables,
        },
      });
    })
    .catch((error) => {
      console.log("user.tables.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "user.tables.error.onfind",
        error: error,
        data: {
          tables: [],
        },
      });
    });
};
