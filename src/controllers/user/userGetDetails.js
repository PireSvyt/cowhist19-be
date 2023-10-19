require("dotenv").config();
const jwt_decode = require("jwt-decode");

const User = require("../../models/User.js");

module.exports = userGetDetails = (req, res, next) => {
  /*
  
  provides user details 
  
  NOTE : removes field password
  
  possible response types
  * user.getdetails.success
  * user.getdetails.error.notfound
  * user.getdetails.error.onaggregate
  
  */

  if (process.env.DEBUG) {
    console.log("user.getdetails");
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
        foreignField: "userids",
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
        console.log("user.getdetails.success");
        return res.status(200).json({
          type: "user.getdetails.success",
          data: {
            user: user[0],
          },
        });
      } else {
        console.log("user.getdetails.error.notfound");
        return res.status(403).json({
          type: "user.getdetails.error.notfound",
        });
      }
    })
    .catch((error) => {
      console.log("user.getdetails.error.onaggregate");
      console.error(error);
      return res.status(400).json({
        type: "user.getdetails.error.onaggregate",
        error: error,
      });
    });
};
