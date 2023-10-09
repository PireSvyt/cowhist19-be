require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

module.exports = async function adminDatabaseCommand(req, res, next) {
  /*
  
 provides a number of services to set the test database on certain state
 (for testing purpose only)

    * admin.databasecommand.failedconnection
    * admin.databasecommand.error.unmatchedtype
    * admin.databasecommand.missingaction
    * admin.databasecommand.missingcollection
    * admin.databasecommand.missingtype
    * admin.databasecommand.insertone.success
    * admin.databasecommand.insertone.missingitem
    * admin.databasecommand.insertone.error.oninstert
    * admin.databasecommand.delete.success
    * admin.databasecommand.delete.missingids
    * admin.databasecommand.delete.error.ondelete
    * admin.databasecommand.drop.success
    * admin.databasecommand.drop.error.ondrop
  
  */

  if (process.env.DEBUG === true) {
    console.log("admin.databasecommand");
  }

  return new Promise((resolve, reject) => {
    // DB connection
    if (process.env.DEBUG === true) {
      console.log("Openning server");
    }
    let DB_URL =
      "mongodb+srv://savoyatp:" +
      process.env.DB_PW +
      "@" +
      process.env.DB_CLUSTER +
      "?retryWrites=true&w=majority";
    let mongoClient = new MongoClient(DB_URL, { useNewUrlParser: true });
    mongoClient
      .connect()
      .then((err) => {
        if (process.env.DEBUG === true) {
          console.log("Connected correctly to server");
        }

        // Action
        if (req.body.action != undefined) {
          // Collection
          if (req.body.action.collection != undefined) {
            collection = mongoClient
              .db("test")
              .collection(req.body.action.collection);
            // Type
            if (req.body.action.type != undefined) {
              switch (req.body.action.type) {
                case "insertone":
                  // Type
                  if (req.body.action.item != undefined) {
                    collection
                      .insertOne(req.body.action.item)
                      .then((insertOneResponse) => {
                        if (process.env.DEBUG === true) {
                          console.log(
                            "admin.databasecommand.insertone.success",
                          );
                        }
                        return res.status(200).json({
                          type: "admin.databasecommand.insertone.success",
                          data: insertOneResponse,
                        });
                      })
                      .catch((error) => {
                        console.log(
                          "admin.databasecommand.insertone.error.oninstert",
                        );
                        console.error(error);
                        return res.status(500).json({
                          type: "admin.databasecommand.insertone.error.oninstert",
                          error: error,
                          data: {},
                        });
                      });
                  } else {
                    console.log("admin.databasecommand.insertone.missingitem");
                    return res.status(400).json({
                      type: "admin.databasecommand.insertone.missingitem",
                      data: {},
                    });
                  }
                  break;
                case "delete":
                  // Type
                  if (req.body.action.ids != undefined) {
                    collection
                      .remove({ id: req.body.action.ids })
                      .then((deleteResponse) => {
                        if (process.env.DEBUG === true) {
                          console.log("admin.databasecommand.delete.success");
                        }
                        return res.status(200).json({
                          type: "admin.databasecommand.delete.success",
                          data: deleteResponse,
                        });
                      })
                      .catch((error) => {
                        console.log(
                          "admin.databasecommand.delete.error.ondelete",
                        );
                        console.error(error);
                        return res.status(500).json({
                          type: "admin.databasecommand.delete.error.ondelete",
                          error: error,
                          data: {},
                        });
                      });
                  } else {
                    console.log("admin.databasecommand.delete.missingids");
                    return res.status(400).json({
                      type: "admin.databasecommand.delete.missingids",
                      data: {},
                    });
                  }
                  break;
                case "drop":
                  collection
                    .drop()
                    .then((dropResponse) => {
                      if (process.env.DEBUG === true) {
                        console.log("admin.databasecommand.drop.success");
                      }
                      return res.status(200).json({
                        type: "admin.databasecommand.drop.success",
                        data: dropResponse,
                      });
                    })
                    .catch((error) => {
                      console.log("admin.databasecommand.drop.error.ondrop");
                      console.error(error);
                      return res.status(500).json({
                        type: "admin.databasecommand.drop.error.ondrop",
                        error: error,
                        data: dropResponse,
                      });
                    });
                  break;
                default:
                  log.push("ERROR > action type not switched", req.body.action);
                  console.log("admin.databasecommand.error.unmatchedtype");
                  console.error(error);
                  return res.status(400).json({
                    type: "admin.databasecommand.error.unmatchedtype",
                    error: error,
                    data: {},
                  });
              }
            } else {
              console.log("admin.databasecommand.missingtype");
              resolve({
                type: "admin.databasecommand.missingtype",
                action: req.body.action,
              });
            }
          } else {
            console.log("admin.databasecommand.missingcollection");
            return res.status(400).json({
              type: "admin.databasecommand.missingcollection",
              data: {},
            });
          }
        } else {
          console.log("admin.databasecommand.missingaction");
          resolve({
            type: "admin.databasecommand.missingaction",
            action: req.body,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          type: "admin.databasecommand.failedconnection",
          error: err,
          data: {},
        });
      });
  });
};
