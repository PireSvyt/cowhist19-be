require("dotenv").config();

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("auth.authenticateToken token " + token);

  if (token === null) {
    return res.status(401).json({ message: "Invalid token" });
  } else {
    jwt
      .verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: err });
        req.user = user;
        next();
      })
      .catch((error) =>
        res
          .status(500)
          .json({ error, message: "erreur lors du check de token" })
      );
  }
};
