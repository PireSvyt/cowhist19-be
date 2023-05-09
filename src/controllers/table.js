const Table = require("../models/Table.js");
const Game = require("../models/Game.js");
const contracts = require("../ressources/contracts.json");

// NEW CONTROLLER EXISTING
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
    tableToSave.players.forEach((player) => {
      tableUsers.push(player._id);
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

// NEW CONTROLLER EXISTING
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

// NEW CONTROLLER EXISTING
exports.details = (req, res, next) => {
  /*
  provides the details of a table
  
  TODO
  * only users from the table can do this
  
  */
  console.log("table.details");
  // Initialize
  var status = 500;

  Table.aggregate([
    {
      $match: {
        id: req.params.id,
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "id",
        localField: "users",
        as: "players",
        pipeline: [
          {
            $project: {
              _id: 1,
              pseudo: 1,
              status: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        players: 1,
      },
    },
  ])
    .then((tables) => {
      if (tables.length === 1) {
        let table = tables[0];
        table.contracts = contracts;
        // Response
        status = 200; // OK
        res.status(status).json({
          status: status,
          message: "table ok",
          table: table,
        });
      } else {
        status = 400; // OK
        res.status(status).json({
          status: status,
          message: "error on find",
          table: {},
        });
      }
    })
    .catch((error) => {
      status = 400; // OK
      console.error(error);
      res.status(status).json({
        status: status,
        message: "error on aggregate",
        table: {},
        error: error,
      });
    });
};

// NEW CONTROLLER EXISTING
exports.stats = (req, res, next) => {
  /*
  provides the stats according to given parameters
  
  body parameters are transfered to the processGames function 
  
  TODO
  * only users from the table can do this
    - ranking
    - graph
  
  */
  console.log("table.stats");
  var status = 500;

  Game.find({ table: req.params.id })
    .then((games) => {
      // Post process
      let stats = processGames(games, req.body);
      // Response
      status = 200; // OK
      res.status(status).json({
        status: status,
        message: "stats ok",
        stats: stats,
      });
    })
    .catch((error) => {
      status = 400; // OK
      console.error(error);
      res.status(status).json({
        status: status,
        message: "error on find",
        stats: {},
        error: error,
      });
    });
};

// NEW CONTROLLER EXISTING
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
        fields = "contract outcome players date";
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
      .then((games) => {
        //console.log("games " + games);
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

// Helpers

// NEW SERVICE EXISTING
function processGames(games, request) {
  /*
  process the game list to provide stats according to request
  
  body parameters
  * need : for post processing purpose
  
  TODO
  * only users from the table can do this
    - ranking
    - graph
  
  */
  console.log("table.processGames");

  let stats = {};
  let players = {};

  // Summarize game outcomes per user
  games.forEach((game) => {
    if (checkContract(game)) {
      game.players.forEach((player) => {
        // Add player to players if missing
        if (!Object.keys(players).includes(player._id)) {
          players[player._id] = {
            _id: player._id,
            attackWins: 0,
            attackLoss: 0,
            defenseWins: 0,
            defenseLoss: 0,
          };
        }
        // Record outcome
        if (game.outcome < 0) {
          if (player.role === "attack") {
            players[player._id].attackLoss += 1;
          }
          if (player.role === "defense") {
            players[player._id].defenseWins += 1;
          }
        } else {
          if (player.role === "attack") {
            players[player._id].attackWins += 1;
          }
          if (player.role === "defense") {
            players[player._id].defenseLoss += 1;
          }
        }
      });
    }
  });

  // Compute a score
  for (const [id, player] of Object.entries(players)) {
    // Number of games
    players[id].games =
      player.attackWins +
      player.attackLoss +
      player.defenseWins +
      player.defenseLoss;
    // Attack rate
    players[id].rateattack =
      (player.attackWins + player.attackLoss) / player.games;
    // Win rate
    players[id].ratevictory =
      (player.attackWins + player.defenseWins) / player.games;
    // Cowhist19 V0 score
    // 5+ROUND((0.75*defenseWins-0.75*defenseLoss+1.25*attackWins-1.25*attackLoss)/games*10,1)
    players[id].scorev0 =
      5 +
      ((0.75 * (player.defenseWins - player.defenseLoss) +
        1.25 * (player.attackWins - player.attackLoss)) /
        player.games) *
        10;
  }

  // Make a sorted array
  let playersArray = Object.values(players);
  playersArray.sort(function (a, b) {
    // sorting field
    let f = "scorev0";
    if (a[f] > b[f]) {
      return -1;
    }
    if (a[f] < b[f]) {
      return 1;
    }
    return 0;
  });

  // Stats
  stats.ranking = playersArray;

  return stats;
}

// NEW SERVICE EXISTING
function checkContract(game) {
  /*
  check that a game matches with contract
  
  */
  console.log("table.checkContract");
  let compliance = true;
  let nonCompliances = [];

  let contractList = contracts.filter(
    (contract) => contract.key === game.contract
  );
  let contract = contractList[0];

  if (contract === undefined) {
    compliance = false;
    nonCompliances.push("contract not found");
  } else {
    // Attack
    if (
      game.players.filter((player) => player.role === "attack").length !==
      contract.attack
    ) {
      compliance = false;
      nonCompliances.push("number of attackant(s) does not match");
    }

    // Defense
    if (
      game.players.filter((player) => player.role === "defense").length !==
      contract.defense
    ) {
      compliance = false;
      nonCompliances.push("number of defender(s) does not match");
    }

    // Folds
    if (game.outcome + contract.folds > 13) {
      compliance = false;
      nonCompliances.push("number of folds won exceeds possibilities");
    }
    if (game.outcome < -13) {
      compliance = false;
      nonCompliances.push("number of folds lost exceeds possibilities");
    }
  }

  // Console
  if (nonCompliances.length > 0) {
    console.log("non compliance list : ");
    console.log(nonCompliances);
    console.log("game");
    console.log(game);
    console.log("contract");
    console.log(contract);
  }

  return compliance;
}
