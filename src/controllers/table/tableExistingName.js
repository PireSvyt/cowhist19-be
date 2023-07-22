const Table = require("../../models/Table.js");

module.exports = tableExistingName = (req, res, next) => {
  /*
  
  checks if a table name is already being used
  
  possible response types
  * table.existingname.true
  * table.existingname.false
  * table.existingname.error.onfind
  
  */

  console.log("table.existingname");

  Table.findOne({ name: req.body.name })
    .then((table) => {
      if (!table) {
        console.log("table.existingname.false");
        return res.status(200).json({
          type: "table.existingname.false",
        });
      } else {
        console.log("table.existingname.true");
        return res.status(403).json({
          type: "table.existingname.true",
        });
      }
    })
    .catch((error) => {
      console.log("table.existingname.error.onfind");
      console.error(error);
      return res.status(500).json({
        type: "table.existingname.error.onfind",
        error: error,
      });
    });
};
