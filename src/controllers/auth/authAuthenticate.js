const jwt = require("jsonwebtoken");

module.exports = authAuthenticate = (req, res, next) => {
  /*
  
  authenticate the data in a jwt
  
  possible response types
  * auth.authenticate.error.invalidtoken
  * auth.authenticate.error.nulltoken
  
  */

  console.log("auth.authenticate");

  // Prep
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res.status(403).json({
      type: "auth.authenticate.error.nulltoken",
    });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          type: "auth.authenticate.error.invalidtoken",
          error: err,
        });
      }
      req.user = user;
      next();
    });
  }
};
