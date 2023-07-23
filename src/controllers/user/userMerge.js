const jwt_decode = require("jwt-decode");
const bcrypt = require("bcrypt");
// BCRYPT https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
const CryptoJS = require("crypto-js");

const User = require("../../models/User.js");
const Table = require("../../models/Table.js");
const Game = require("../../models/Game.js");

module.exports = userMerge = (req, res, next) => {
  /*
  
  enables to merge two accounts
  keep traced of merged account pushing disappearing account id to alias
  
  input parameters
  * mergelogin : string login of the account to merge to currently connected account
  * mergepassword : string password of the account to merge to currently connected account
  * encryption : boolean capturing if password is encrypted or not
  
  Notes
  * ubiquity management
    when both accounts are players to a game, the players are left as is
    resulting in counting only once the corresponding game afterward (for current account)
  
  possible response types
  * user.merge.success
  * user.merge.error.onfindcurrentuser
  * user.merge.error.onfindmergeuser
  * user.merge.error.notfoundcurrentuser
  * user.merge.error.notfoundmergeuser
  * user.merge.error.missingpassword
  * user.merge.error.invalidpassword
  * user.merge.error.onpasswordcompare
  * user.merge.error.onsaveuser
  * user.merge.error.onfindtables
  * user.merge.error.onfindgames
  
  */

  console.log("user.merge");

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.findOne({ id: decodedToken.id })
    .then((currentUser) => {
      if (currentUser) {
        User.findOne({ login: req.body.mergelogin })
          .then((mergeuser) => {
            if (mergeuser) {
              // Is merge user credential valid?
              let attemptPassword = req.body.mergepassword;
              // Password decrypt
              if (req.body.encryption === true) {
                attemptPassword = CryptoJS.AES.decrypt(
                  attemptPassword,
                  process.env.ENCRYPTION_KEY
                ).toString(CryptoJS.enc.Utf8);
              }
              // Password compare
              bcrypt
                .compare(attemptPassword, mergeuser.password)
                .then((valid) => {
                  if (!valid) {
                    return res.status(401).json({
                      type: "user.merge.error.invalidpassword",
                    });
                  } else {
                    // Store alias
                    if (currentUser.alias === undefined) {
                      currentUser.alias = [mergeuser.id];
                    } else {
                      if (
                        currentUser.alias.filter(
                          (alias) => alias.id === mergeuser.id
                        ).length
                      ) {
                        // ok alias already stored
                        // but how the hell did this happened!
                      } else {
                        currentUser.alias.push({
                          id: mergeuser.id,
                          login: mergeuser.login,
                        });
                      }
                    }
                    // Save current user
                    currentUser
                      .save()
                      .then(() => {
                        // Replace merged user in tables
                        Table.find({ users: mergeuser.id })
                          .then((tables) => {
                            tables.forEach((table) => {
                              if (table.users.includes(currentUser.id)) {
                                // Remove merged id
                                table.users = table.users.filter(
                                  (player) => player !== mergeuser.id
                                );
                              } else {
                                // Replace merge id
                                table.users = table.users.map((player) => {
                                  if (player !== mergeuser.id) {
                                    return player;
                                  } else {
                                    return currentUser.id;
                                  }
                                });
                              }
                              table.save();
                            });
                          })
                          .catch((error) => {
                            console.log("user.merge.error.onfindtables");
                            console.error(error);
                            return res.status(400).json({
                              type: "user.merge.error.onfindtables",
                              error: error,
                            });
                          });
                        // Replace merged user in games
                        Game.find({ "players._id": mergeuser.id })
                          .then((games) => {
                            games.forEach((game) => {
                              if (
                                Object.keys(game.players).includes(
                                  currentUser.id
                                )
                              ) {
                                // See ubiquity management note
                              } else {
                                // Replace merge id
                                game.players[currentUser.id] =
                                  game.players[mergeuser.id];
                                delete game.players[mergeuser.id];
                                game.save();
                              }
                            });
                          })
                          .catch((error) => {
                            console.log("user.merge.error.onfindgames");
                            console.error(error);
                            return res.status(400).json({
                              type: "user.merge.error.onfindgames",
                              error: error,
                            });
                          });
                      })
                      .catch((error) => {
                        console.log("user.merge.error.onsaveuser");
                        console.error(error);
                        return res.status(400).json({
                          type: "user.merge.error.onsaveuser",
                          error: error,
                        });
                      });
                  }
                })
                .catch((error) => {
                  console.log("user.merge.error.onpasswordcompare");
                  console.log(error);
                  return res.status(500).json({
                    type: "user.merge.error.onpasswordcompare",
                    error: error,
                  });
                });
            } else {
              console.log("user.merge.error.notfoundmergeuser");
              return res.status(403).json({
                type: "user.merge.error.notfoundmergeuser",
              });
            }
          })
          .catch((error) => {
            console.log("user.merge.error.onfindmergeuser");
            return res.status(400).json({
              type: "user.merge.error.onfindmergeuser",
              error: error,
            });
            console.error(error);
          });
      } else {
        console.log("user.merge.error.notfoundcurrentuser");
        return res.status(403).json({
          type: "user.merge.error.notfoundcurrentuser",
        });
      }
    })
    .catch((error) => {
      console.log("user.merge.error.onfindcurrentuser");
      console.error(error);
      return res.status(400).json({
        type: "user.merge.error.onfindcurrentuser",
        error: error,
      });
    });
};
