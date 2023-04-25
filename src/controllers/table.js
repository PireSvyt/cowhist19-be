const Table = require("../models/Table");
const Game = require("../models/Game");
const User = require("../models/User");

exports.save = (req, res, next) => {
  console.log("table.save");
  // Initialize
  var status = 500;
  console.log(req.body);
  // Name violation check
  if (req.body._id === "" || req.body._id === undefined) {
    console.log("table to create");
    // Create
    delete req.body._id;
    const table = new Table({ ...req.body });
    table
      .save()
      .then(() => {
        console.log("table created");
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
    let table = new Table({ ...req.body });
    Table.updateOne({ _id: table._id }, table)
      .then(() => {
        console.log("table modified");
        status = 200;
        res.status(status).json({
          status: status,
          message: "table modified",
          id: req.body.id,
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
  Game.deleteMany({ table: req.params.id }).catch((error) => {
    status = 400; // OK
    res.status(status).json({
      status: status,
      message: "error on delete table's game",
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
  console.log("game.details");
  // Initialize
  var status = 500;
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
        fields = "contract outcome attack defense date";
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
