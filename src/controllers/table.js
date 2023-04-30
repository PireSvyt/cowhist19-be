const Table = require("../models/Table");
const Game = require("../models/Game");
const User = require("../models/User");

exports.save = (req, res, next) => {
  /*
  
  TODO
  * check user ids existance
  * only users from the table can do this
  
  */
  console.log("table.save");
  // Initialize
  var status = 500;
  console.log(req.body);
  // Save
  if (req.body._id === "" || req.body._id === undefined) {
    console.log("table to create");
    // Create
    delete req.body._id;
    const table = new Table({ ...req.body });
    // Prep
    let tableUsers = [];
    table.users.forEach((user) => {
      tableUsers.push(user._id);
    });
    table.users = tableUsers;
    // Add table to users
    table.users.forEach((player) => {
      User.findOne({ _id: player })
        .then((user) => {
          user.tables.push(table._id);
          user.save();
        })
        .catch((error) => {
          status = 400; // OK
          res.status(status).json({
            status: status,
            message: "error on user update",
            error: error,
            table: req.body,
          });
          console.error(error);
        });
    });
    // Save
    table
      .save()
      .then(() => {
        console.log("table created");
        // Response
        status = 201;
        res.status(status).json({
          status: status,
          message: "table created",
          id: table._id,
        });
      })
      .catch((error) => {
        console.log("error on create");
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on create",
          error: error,
          table: req.body,
        });
      });
  } else {
    // Modify
    console.log("table to modify");
    console.log(req.body);
    let tableToSave = new Table({ ...req.body });
    // Prep
    let tableUsers = [];
    tableToSave.users.forEach((user) => {
      tableUsers.push(user._id);
    });
    tableToSave.users = tableUsers;
    // Manage table to users
    Table.findOne({ _id: tableToSave._id })
      .then((table) => {
        // Check users to be removed
        table.users.forEach((player) => {
          if (!player in tableToSave.users) {
            // Remove table from user
            User.findOne({ _id: player })
              .then((user) => {
                let sublist = user.tables.filter((tableid) => {
                  return tableid !== table._id;
                });
                user.tables = sublist;
                user.save();
              })
              .catch((error) => {
                status = 400; // OK
                res.status(status).json({
                  status: status,
                  message: "error on user update",
                  error: error,
                  table: req.body,
                });
                console.error(error);
              });
          }
        });
        // Check users to be added
        tableToSave.users.forEach((player) => {
          if (!player in table.users) {
            // Add table to user
            User.findOne({ _id: player })
              .then((user) => {
                user.tables.push(table._id);
                user.save();
              })
              .catch((error) => {
                status = 400; // OK
                res.status(status).json({
                  status: status,
                  message: "error on user update",
                  error: error,
                  table: req.body,
                });
                console.error(error);
              });
          }
        });
      })
      .catch((error) => {
        console.log("error on user update");
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on modify",
          error: error,
          table: req.body,
        });
        console.error(error);
      });
    // Response
    // Save
    Table.updateOne({ _id: tableToSave._id }, tableToSave)
      .then(() => {
        console.log("table modified");
        status = 200;
        res.status(status).json({
          status: status,
          message: "table modified",
          id: tableToSave._id,
        });
      })
      .catch((error) => {
        console.log("error on modified");
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on modify",
          error: error,
          table: req.body,
        });
        console.error(error);
      });
  }
};

exports.delete = (req, res, next) => {
  /*
  
  TODO
  * only users from the table can do this
  
  */
  console.log("table.delete");
  // Initialize
  var status = 500;

  // Delete table from users
  Table.findOne({ _id: req.params.id })
    .then((table) => {
      table.users.forEach((userid) => {
        User.findOne({ _id: userid })
          .then((user) => {
            user.tables = user.tables.splice(
              user.tables.indexOf(req.params.id),
              1
            );
            User.updateOne({ _id: userid }, user).catch((error) => {
              console.log("error on modified");
              status = 400; // OK
              res.status(status).json({
                status: status,
                message: "error on modify user",
                error: error,
                table: req.body,
              });
              console.error(error);
            });
          })
          .catch((error) => {
            status = 400; // OK
            res.status(status).json({
              status: status,
              message: "error on find user",
              error: error,
            });
            console.error(error);
          });
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find table",
        error: error,
      });
      console.error(error);
    });

  // Delete table's games
  Game.deleteMany({ table: req.params.id })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on delete table's game",
        error: error,
      });
      console.error(error);
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on delete games",
        error: error,
      });
      console.error(error);
    });

  // Delete table
  Table.deleteOne({ _id: req.params.id })
    .then(() => {
      status = 200;
      res.status(status).json({
        status: status,
        message: "table deleted",
      });
    })
    .catch((error) => {
      status = 400;
      res.status(status).json({
        status: status,
        message: "error on find",
        error: error,
        table: req.body,
      });
      console.error(error);
    });
};

exports.details = (req, res, next) => {
  /*
  provides the details of a table
  
  TODO
  * only users from the table can do this
  
  */
  console.log("game.details");
  // Initialize
  var status = 500;
  var message = "";
  Table.findOne({ _id: req.params.id })
    .then((table) => {
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "table ok",
        table: table,
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on find",
        table: {},
        error: error,
      });
      console.error(error);
    });
};

exports.stats = (req, res, next) => {
  return res.status(500).json({ message: "TODO table.stats" });
};

exports.history = (req, res, next) => {
  /*
  provides a list of games sorted per date
  
  body parameters
  * need : for post processing purpose
    - list : simple list of existing fields without post processing
  * games.index : index of first to retrieve from last one (in time)
  * games.number : number of games to retrive from games.index
  
  TODO
  * only users from the table can do this
  
  */

  console.log("table.history");
  // Initialize
  var status = 500;
  var filters = {};
  var fields = "";
  var where = "";

  // useful
  function compare(a, b) {
    if (a.date > b.date) {
      return 1;
    } else {
      return -1;
    }
  }

  // Needs
  if (!req.body.need) {
    status = 403; // Access denied
  } else {
    switch (req.body.need) {
      case "list":
        filters = { table: req.params.id };
        fields = "contract outcome users date";
        break;
      default:
        status = 403; // Access denied
    }
  }

  if (status === 403) {
    res.status(status).json({
      status: status,
      message: "error on prior filtering",
      games: [],
    });
  } else {
    // Find
    //https://mongoosejs.com/docs/api.html#model_Model.find
    // executes, name LIKE john and only selecting the "name" and "friends" fields
    // await MyModel.find({ name: /john/i }, 'name friends').exec();
    Game.find(filters, fields)
      .where(where)
      .exec()
      .then((games) => {
        console.log("games " + games);
        games.sort(compare);
        games = games.splice(req.body.games.index, req.body.games.number);
        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "list ok",
          games: games,
        });
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on find",
          games: [],
          error: error,
        });
        console.error(error);
      });
  }
};
