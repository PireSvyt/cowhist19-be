require("dotenv").config();
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

  if (process.env.DEBUG) {
    console.log("user.details");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.aggregate([
    {
      $match: {
        userid: decodedToken.userid,
      },
    },
    {
      $lookup: {
        from: "tables",
        foreignField: "users",
        localField: "userid",
        as: "tables",
        pipeline: [
          {
            $project: {
              tableid: 1,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        userid: 1,
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
        console.log("user.details.success");
        return res.status(200).json({
          type: "user.details.success",
          data: {
            user: user[0],
          },
        });
      } else {
        console.log("user.details.error.notfound");
        return res.status(403).json({
          type: "user.details.error.notfound",
        });
      }
    })
    .catch((error) => {
      console.log("user.details.error.onaggregate");
      console.error(error);
      return res.status(400).json({
        type: "user.details.error.onaggregate",
        error: error,
      });
    });
};
