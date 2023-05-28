const jwt_decode = require("jwt-decode");

const serviceCheckAdmin = require("./services/serviceCheckAdmin.js");
const servicePopulate = require("./services/servicePopulate");

module.exports = populate = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.populate.success
  * admin.populate.error.unauthorized (in prod)
  * admin.populate.error.deniedaccess
  * admin.populate.error.failedpopulation
  
  */

  console.log("admin.populate");

  if (process.env.NODE_ENV === "_production") {
    res.status(401).json({
      type: "admin.populate.error.unauthorized",
    });
  } else {
    // Check access
    serviceCheckAdmin(req.headers["authorization"]).then((access) => {
      if (!access.outcome) {
        // Unauthorized
        res.status(401).json({
          type: "admin.populate.error.deniedaccess",
          error: access.reason,
        });
      } else {
        servicePopulate().then((population) => {
          if (population.outcome === "success") {
            // Successful populated
            res.status(200).json({
              type: "admin.populate.success",
            });
          } else {
            // Failed populated
            res.status(500).json({
              type: "admin.populate.error.failedpopulation",
              error: access.reason,
            });
          }
        });
      }
    });
  }
};
