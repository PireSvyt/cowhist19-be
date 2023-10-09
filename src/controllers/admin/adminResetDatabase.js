require("dotenv").config();
const serviceResetDatabase = require("./services/serviceResetDatabase");

module.exports = adminResetDatabase = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.resetdatabase.success
  * admin.resetdatabase.error.unauthorized (in prod)
  * admin.resetdatabase.error.failedpopulation
  
  */

  if (process.env.DEBUG) {
    console.log("admin.resetdatabase");
  }

  if (process.env.NODE_ENV === "_production") {
    res.status(401).json({
      type: "admin.resetdatabase.error.unauthorized",
    });
  } else {
    serviceResetDatabase(req.body).then((population) => {
      if (population.type === "admin.serviceresetdatabase.success") {
        // Successful populated
        res.status(200).json({
          type: "admin.resetdatabase.success",
        });
      } else {
        // Failed populated
        res.status(500).json({
          type: "admin.resetdatabase.error.failed",
          error: population.error,
        });
      }
    });
  }
};
