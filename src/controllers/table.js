const mongoose = require('mongoose');

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
  //console.log(req.body);
  // Save
  if (req.body._id === "" || req.body._id === undefined) {
    console.log("table to create");
    // Prep
    delete req.body._id;
    let tableToSave = { ...req.body };
    let tableUsers = [];
    tableToSave.users.forEach((user) => {
      tableUsers.push(user._id);
    });
    tableToSave.users = tableUsers;
    console.log("table to save ");
    console.log(tableToSave);
    // Generate
    tableToSave = new Table(tableToSave);
    tableToSave.id = tableToSave._id;
    // Save
    tableToSave
      .save()
      .then(() => {
        console.log("table created");
        // Response
        status = 201;
        res.status(status).json({
          status: status,
          message: "table created",
          id: tableToSave._id,
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
    let tableToSave = { ...req.body };
    // Prep
    let tableUsers = [];
    tableToSave.users.forEach((user) => {
      tableUsers.push(user._id);
    });
    tableToSave.users = tableUsers;
    console.log("table to save ");
    console.log(tableToSave);
    // Manage table to users
    Table.findOne({ _id: tableToSave._id })
      .then((table) => {
        console.log("found table " + table._id);
        console.log(table);
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
  console.log("table.details");
  // Initialize
  var status = 500;

  
 
  Table.findOne({ _id: req.params.id }, "name users")
    .then((table) => {
      // Get user details
      User.find( {}, "pseudo login status" ).where('id').in(table.users).exec()
      .Then((users) => {
        // Response
        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "table ok",
          table: {
            _id: table._id,
            name: table.name,
            users:  users
          },
        });
      })
      .catch((error) => {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on user find",
          table: {},
          error: error,
        });
        console.error(error);
      });
    })
    .catch((error) => {
      status = 400; // OK
      res.status(status).json({
        status: status,
        message: "error on table find",
        table: {},
        error: error,
      });
      console.error(error);
    });
    
/*
   Table.aggregate([
      { $match: { 
          id: req.params.id
      } },
      { $lookup: { 
          from: 'User',
          foreignField: 'id', 
          localField: 'users', 
          as: 'players',
      } }
    ])
    .then((table) => {
      // Response
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "table ok",
        table: table,
      });
    })
    .catch((error) => {
      status = 400; // OK
      console.error(error);
      res.status(status).json({
        status: status,
        message: "error on table find",
        table: {},
        error: error,
      });
    });*/
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
