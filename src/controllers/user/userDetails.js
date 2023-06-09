const jwt_decode = require("jwt-decode");

const User = require("../../models/User.js");

module.exports = userDetails = (req, res, next) => {
  /*
  
  provides user details 
  
  NOTE : removes field password
  
  possible response types
  * user.details.success
  * user.details.error.notfound
  * user.details.error.onaggregate
  
  */

  console.log("user.details");

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.aggregate([
    {
      $match: {
        id: decodedToken.id,
      },
    },
    {
      $lookup: {
        from: "tables",
        foreignField: "users",
        localField: "id",
        as: "tables",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        pseudo: 1,
        login: 1,
        status: 1,
        priviledges: 1,
        tables: 1,
      },
    },
  ])
    .then((user) => {
      if (user.length === 1) {
        res.status(200).json({
          type: "user.details.success",
          data: {
            user: user[0],
          },
        });
      } else {
        res.status(403).json({
          type: "user.details.error.notfound",
          data: {
            user: {},
          },
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        type: "user.details.error.onaggregate",
        error: error,
        data: {
          user: {},
        },
      });
      console.error(error);
    });
};
