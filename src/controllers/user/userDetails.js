const jwt_decode = require("jwt-decode");

const User = require("../../models/User.js");

module.exports = userDetails = (req, res, next) => {
  /*
  
  provides user details 
  
  NOTE : removes field password
  
  possible response types
  * user.invite.success.created
  
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
          message: "user ok",
          data: {
            user: user[0],
          },
        });
      } else {
        res.status(403).json({
          type: "user.details.error.notfound",
          message: "error on user find",
          data: {
            user: {},
          },
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        type: "user.details.error.onaggregate",
        message: "error on aggregate",
        error: error,
        data: {
          user: {},
        },
      });
      console.error(error);
    });
};
