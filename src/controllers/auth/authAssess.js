const jwt = require("jsonwebtoken");

module.exports = authAssess = (req, res, next) => {
  /*
  
  assess the data in a jwt
  
  possible response types
  * auth.assess.error.validtoken
  * auth.assess.error.invalidtoken
  * auth.assess.error.nulltoken
  
  */

  console.log("auth.assess");

  // Assess
  if (req.body.token === null || req.body.token === undefined) {
    return res.status(401).json({
      type: "auth.assess.error.nulltoken",
    });
  } else {
    jwt.verify(req.body.token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.status(404).json({
          type: "auth.assess.error.invalidtoken",
          error: err,
        });
      }
      // Token is valid
      return res.status(200).json({
        type: "auth.assess.error.validtoken",
      });
    });
  }
};
