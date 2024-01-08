require("dotenv").config();
const servicePopulate = require("./services/servicePopulate");

module.exports = adminPopulate = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.populate.success
  * admin.populate.error.unauthorized (in prod)
  * admin.populate.error.failedpopulation
  
  */

  if (process.env.DEBUG) {
    console.log("admin.populate");
  }

  if (process.env.NODE_ENV === "_production") {
    res.status(401).json({
      type: "admin.populate.error.unauthorized",
    });
  } else {
    servicePopulate(req.body).then((population) => {
      if (population.type === "admin.servicepopulate.success") {
        // Successful populated
        res.status(200).json({
          type: "admin.populate.success",
        });
      } else {
        // Failed populated
        res.status(500).json({
          type: "admin.populate.error.failedpopulation",
          error: population.error,
        });
      }
    });
  }
};
