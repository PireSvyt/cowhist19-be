const Table = require("../../models/Table.js");

module.exports = tableExistingName = (req, res, next) => {
  /*
  
  checks if a table name is already being used
  
  possible response types
  * table.existingname.true
  * table.existingname.false
  * table.existingname.error.onfind
  
  */

  console.log("auth.existingname");

  Table.findOne({ name: req.body.name })
    .then((table) => {
      if (table === undefined) {
        // Name is available
        res.status(200).json({
          type: "table.existingname.false",
        });
      } else {
        // Name is being used
        res.status(404).json({
          type: "table.existingname.true",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        type: "table.existingname.error.onfind",
        error: error,
      });
    });
};
