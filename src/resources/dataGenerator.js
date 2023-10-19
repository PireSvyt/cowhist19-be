const bcrypt = require("bcrypt");
const contracts = require("./contracts.json");
const toolkit = require("./toolkit.js");

module.exports = {
  objectGenerator: objectGenerator,
  userGenerator: userGenerator,
  tableGenerator: tableGenerator,
  gameGenerator: gameGenerator,
};

function objectGenerator(type, count = 1, perimeter = {}) {
  if (count > 1) {
    // Self call in loop when count exceeds 1
    let list = [];
    do {
      list.push(objectGenerator(type, 1, perimeter));
    } while (list.length < count);
    return list;
  } else {
    let result = {};
    switch (type) {
      case "user":
        result = userGenerator(perimeter);
        break;
      case "table":
        result = tableGenerator(perimeter);
        break;
      case "game":
        result = gameGenerator(perimeter);
        break;
      default:
        console.log("objectGenerator switch type unrecognized: ", type);
        return undefined;
    }

    // Result
    return result;
  }
}

function userGenerator() {
  let rid = toolkit.random_id(16);
  let rstring = toolkit.random_string();

  return {
    userid: rstring,
    login: rid + "@yopmail.com",
    password: bcrypt.hashSync(rid, 10),
    pseudo: rid,
    status: "activated",
  };
}

function tableGenerator(tablePerimeter = {}) {
  let rid = toolkit.random_id(16);
  let rstring = toolkit.random_string();

  let table = {
    tableid: rstring,
    name: rstring,
    guests: 0,
    userids: [],
  };

  // Guests
  if (tablePerimeter.guests !== undefined) {
    table.guests = toolkit.pickFromArray(tablePerimeter.guests.list);
  }
  // Userids
  if (tablePerimeter.userids !== undefined) {
    table.userids = tablePerimeter.userids.list.map((user) => {
      return user.userid;
    });
  }

  return table;
}

function gameGenerator(gamePerimeter = {}) {
  let rid = toolkit.random_id(16);
  let rstring = toolkit.random_string();

  let game = {
    gameid: rstring,
    tableid: rstring,
    date: new Date(),
    contract: "9plis",
    outcome: 0,
    players: [],
  };

  // tableid
  if (gamePerimeter.tableid !== undefined) {
    game.tableid = toolkit.pickFromArray(gamePerimeter.tableid.list);
  }
  // contract
  let fullContract = undefined;
  if (gamePerimeter.contract !== undefined) {
    game.contract = toolkit.pickFromArray(gamePerimeter.contract.list);
  }
  fullContract = contracts.filter((contract) => {
    return contract.key === game.contract;
  })[0];
  // outcome
  if (gamePerimeter.outcome !== undefined) {
    game.outcome = toolkit.pickFromArray(gamePerimeter.outcome.list);
  } else {
    // Random from contract possible range
    let outcomeMax = 13 - fullContract.folds;
    let outcomeMin = -fullContract.folds;
    let outcomeOptions = [];
    for (let i = outcomeMin; i <= outcomeMax; i++) {
      outcomeOptions.push(i);
    }
    game.outcome = toolkit.pickFromArray(outcomeOptions);
  }
  // players
  if (gamePerimeter.players !== undefined) {
    let playersCandidate = toolkit.pickFromArray(gamePerimeter.players.list, 4);
    let playersWithRolesCandidate = [];
    // defense
    playersWithRolesCandidate = toolkit
      .pickFromArray(playersCandidate, fullContract.defense)
      .map((candidate) => {
        return {
          userid: candidate.userid,
          role: "defense",
        };
      });
    // attack
    playersCandidate.forEach((candidate) => {
      if (
        !playersWithRolesCandidate
          .map((wr) => {
            return wr.userid;
          })
          .includes(candidate.userid)
      ) {
        playersWithRolesCandidate.push({
          userid: candidate.userid,
          role: "attack",
        });
      }
    });
    game.players = playersWithRolesCandidate;
  }

  return game;
}
