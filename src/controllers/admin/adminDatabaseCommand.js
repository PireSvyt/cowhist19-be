require("dotenv").config();
const jwt_decode = require("jwt-decode");
const User = require("../../models/User.js");
const Game = require("../../models/Game.js");
const Table = require("../../models/Table.js");
const Feedback = require("../../models/Feedback.js");
const Notification = require("../../models/Notification.js");

module.exports = async function adminDatabaseCommand(req, res, next) {
  /*
  
 provides a number of services to set the test database on certain state
 (for testing purpose only)

    * admin.databasecommand.failedconnection
    * admin.databasecommand.error.unmatchedtype
    * admin.databasecommand.missingaction
    * admin.databasecommand.collectionmistmatch
    * admin.databasecommand.missingcollection
    * admin.databasecommand.missingtype
    * ...
  
  */

  if (process.env.DEBUG === true) {
    console.log("admin.databasecommand");
  }
  console.log("action", req.body.action);

  return new Promise((resolve, reject) => {
    let collection = undefined;
    // Action
    if (req.body.action != undefined) {
      // Collection
      if (req.body.action.collection != undefined) {
        if (process.env.DEBUG === true) {
          console.log("action", req.body.action);
        }
        switch (req.body.action.collection) {
          case "users":
            collection = User;
            break;
          case "games":
            collection = Game;
            break;
          case "tables":
            collection = Table;
            break;
          case "notifications":
            collection = Notification;
            break;
          case "feedbacks":
            collection = Feedback;
            break;
          case "all":
            // see action.type case "clean up all"
            break;
          default:
            //
            console.log("admin.databasecommand.collectionmistmatch");
            return res.status(400).json({
              type: "admin.databasecommand.collectionmistmatch",
              data: {},
            });
        }
        // Type
        if (req.body.action.type != undefined) {
          switch (req.body.action.type) {
            case "get":
              // Type
              if (req.body.action.filter != undefined) {
                filter = {};
                filter[req.body.action.filter.key] =
                  req.body.action.filter.value;
                collection
                  .find()
                  .where(filter)
                  .then((itemList) => {
                    if (itemList.length === req.body.action.ids.length) {
                      if (process.env.DEBUG === true) {
                        console.log("admin.databasecommand.get.success");
                      }
                      return res.status(200).json({
                        type: "admin.databasecommand.get.success",
                        data: { items: itemList },
                      });
                    } else {
                      return res.status(400).json({
                        type: "admin.databasecommand.get.error.partialmatch",
                        data: { items: itemList },
                      });
                    }
                  })
                  .catch((error) => {
                    console.log("admin.databasecommand.get.error.onfind");
                    console.error(error);
                    return res.status(500).json({
                      type: "admin.databasecommand.get.error.onfind",
                      error: error,
                      data: {},
                    });
                  });
              } else {
                console.log("admin.databasecommand.get.missingfilter");
                return res.status(400).json({
                  type: "admin.databasecommand.get.missingfilter",
                  data: {},
                });
              }
              break;
            case "insertmany":
              // Type
              if (req.body.action.items != undefined) {
                collection
                  .insertMany(req.body.action.items)
                  .then((insertManyResponse) => {
                    if (process.env.DEBUG === true) {
                      console.log("admin.databasecommand.insertmany.success");
                    }
                    return res.status(200).json({
                      type: "admin.databasecommand.insertmany.success",
                      data: insertManyResponse,
                    });
                  })
                  .catch((error) => {
                    console.log(
                      "admin.databasecommand.insertmany.error.oninstert",
                    );
                    console.error(error);
                    return res.status(500).json({
                      type: "admin.databasecommand.insertmany.error.oninstert",
                      error: error,
                      data: {},
                    });
                  });
              } else {
                console.log("admin.databasecommand.insertmany.missingitems");
                return res.status(400).json({
                  type: "admin.databasecommand.insertmany.missingitems",
                  data: {},
                });
              }
              break;
            case "delete":
              // Type
              if (req.body.action.filter != undefined) {
                if (process.env.NODE_ENV === "_production") {
                  if (process.env.DEBUG === true) {
                    console.log("admin.databasecommand.delete.denied");
                  }
                  return res.status(403).json({
                    type: "admin.databasecommand.delete.denied",
                    message: "command unauthorized in production",
                  });
                } else {
                  filter = {};
                  filter[req.body.action.filter.key] =
                    req.body.action.filter.value;
                  collection
                    .deleteMany()
                    .where(filter)
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
                }
              } else {
                console.log("admin.databasecommand.delete.missingids");
                return res.status(400).json({
                  type: "admin.databasecommand.delete.missingids",
                  data: {},
                });
              }
              break;
            case "drop":
              if (process.env.NODE_ENV === "_production") {
                if (process.env.DEBUG === true) {
                  console.log("admin.databasecommand.drop.denied");
                }
                return res.status(403).json({
                  type: "admin.databasecommand.drop.denied",
                  message: "command unauthorized in production",
                });
              } else {
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
              }
              break;
            case "cleanup":
              if (process.env.NODE_ENV === "_production") {
                if (process.env.DEBUG === true) {
                  console.log("admin.databasecommand.cleanup.denied");
                }
                return res.status(403).json({
                  type: "admin.databasecommand.cleanup.denied",
                  message: "command unauthorized in production",
                });
              } else {
                const authHeader = req.headers["authorization"];
                const token = authHeader && authHeader.split(" ")[1];
                const decodedToken = jwt_decode(token);

                let deletes = {};
                Game.deleteMany()
                  .then((gameOutcome) => {
                    deletes["game"] = gameOutcome;
                    Table.deleteMany().then((tableOutcome) => {
                      deletes["table"] = tableOutcome;
                      Notification.deleteMany().then((notifOutcome) => {
                        deletes["notif"] = notifOutcome;
                        Feedback.deleteMany().then((feedOutcome) => {
                          deletes["feed"] = feedOutcome;
                          User.deleteMany({
                            userid: { $ne: decodedToken.userid },
                          }).then((userOutcome) => {
                            deletes["user"] = userOutcome;
                            if (process.env.DEBUG === true) {
                              console.log(
                                "admin.databasecommand.cleanup.success",
                              );
                            }
                            return res.status(200).json({
                              type: "admin.databasecommand.cleanup.success",
                              data: deletes,
                            });
                          });
                        });
                      });
                    });
                  })
                  .catch((error) => {
                    console.log("admin.databasecommand.cleanup.error");
                    console.error(error);
                    return res.status(500).json({
                      type: "admin.databasecommand.cleanup.error",
                      error: error,
                      data: drops,
                    });
                  });
              }
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
  });
};
