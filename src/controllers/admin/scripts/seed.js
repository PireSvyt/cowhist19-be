const MongoClient = require("mongodb").MongoClient;
const contracts = require("../../../resources/contracts.json");
var {
  adjustProbabilities,
  pickOne,
  random_id,
} = require("../../../resources/toolkit.js");

function getDateDict(lastWeeks, weekdaysLikelihoods) {
  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  var dateDict = {};
  var currentDate = new Date(Date.now());
  for (var d = 0; d > -lastWeeks * 7; d--) {
    let weekday = weekdays[currentDate.getDay()];
    dateDict[random_id()] = {
      date: new Date(currentDate),
      weekday: weekday,
      likelihood: weekdaysLikelihoods[weekday],
    };
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return dateDict;
}

async function seedDB() {
  try {
    // inputs
    const inputs = {
      weeks: 10,
      nbgames: 10,
      likelihood: {
        players: {
          "6457f5b9746d3231b7dab2cc": 0.3,
          "645f8bb50a53a91da62b31b0": 0.2,
          "645f8bcd0a53a91da62b31b7": 0.2,
          "645f8bdf0a53a91da62b31be": 0.1,
          "6462e8de6e1746f44a560ed1": 0.2,
        },
        days: {
          mon: 0.025,
          tue: 0.1,
          wed: 0.8,
          thu: 0.1,
          fri: 0.025,
          sat: 0.0,
          sun: 0.0,
        },
        outcomes: {
          "by-2": { likelihood: 0.1, folds: -2 },
          "by-1": { likelihood: 0.2, folds: -1 },
          "by+0": { likelihood: 0.4, folds: 0 },
          "by+1": { likelihood: 0.2, folds: 1 },
          "by+2": { likelihood: 0.1, folds: 2 },
        },
        contracts: {
          coop: 0.7,
          trou: 0.2,
          solo: 0.05,
          fixed: 0.05,
        },
      },
      locked: {
        days: ["sat", "sun"],
        contracts: ["grandchelem", "grandemisereetalee", "grandemiserz"],
      },
    };

    // Adjust contract likelihoods
    console.log("Adjusting contacts");
    contracts.forEach((contract) => {
      if (inputs.locked.contracts.includes(contract.type)) {
        contract.likelihood = 0;
      } else {
        for (let c in inputs.likelihood.contracts) {
          if (contract.type === c) {
            contract.likelihood = inputs.likelihood.contracts[c];
          }
        }
      }
    });
    let adjustedContracts = adjustProbabilities(contracts, "likelihood");
    console.log("adjustedContracts");
    console.log(adjustedContracts);
    // Adjust outcome likelihood
    console.log("Adjusting outcomes");
    let adjustedOutcomes = adjustProbabilities(
      inputs.likelihood.outcomes,
      "likelihood",
    );
    console.log("adjustedOutcomes");
    console.log(adjustedOutcomes);
    // Adjust player likelihood
    console.log("Adjusting playuers");
    let adjustedPlayers = adjustProbabilities(inputs.likelihood.players);
    console.log("adjustedPlayers");
    console.log(adjustedPlayers);
    // Adjust date likelihood
    console.log("Adjusting dates");
    let adjustedWeekdays = adjustProbabilities(inputs.likelihood.days);
    console.log("adjustedWeekdays");
    console.log(adjustedWeekdays);
    let candidateDates = getDateDict(inputs.weeks, adjustedWeekdays);
    let adjustedDates = adjustProbabilities(candidateDates, "likelihood");
    console.log("adjustedDates");
    console.log(adjustedDates);

    // Game builder
    let tableid = "6d6f636b65647461626c6531";

    function buildGame() {
      // Contract
      let contractId = pickOne(adjustedContracts, "likelihood");
      let contract =
        adjustedContracts[pickOne(adjustedContracts, "likelihood")].key;

      // Outcome
      let outcome =
        adjustedOutcomes[pickOne(adjustedOutcomes, "likelihood")].folds;

      // Players
      let players = [];
      // Attack
      let attack = [];
      while (attack.length < adjustedContracts[contractId].attack) {
        let attackantCandidate = pickOne(adjustedPlayers);
        if (!attack.includes(attackantCandidate)) {
          attack.push(attackantCandidate);
        }
      }
      attack.forEach((attackant) => {
        players.push({
          userid: attackant,
          role: "attack",
        });
      });
      // Defense
      let defenseCandidates = adjustProbabilities(
        Object.fromEntries(
          Object.entries(inputs.likelihood.players).filter(([key, value]) => {
            return !attack.includes(key);
          }),
        ),
      );
      let defense = [];
      for (let p = 1; p <= adjustedContracts[contractId].defense; p++) {
        defense.push(pickOne(defenseCandidates));
      }
      defense.forEach((defenser) => {
        players.push({
          userid: defenser,
          role: "defense",
        });
      });
      // Date
      let date = adjustedDates[pickOne(adjustedDates, "likelihood")].date;

      // build resulting game
      let game = {
        tableid: tableid,
        contract: contract,
        outcome: outcome,
        players: players,
        date: date,
      };
      //console.log(game);
      return game;
    }

    // Generate games
    console.log("Generating games");
    let games = [];
    for (let g = 0; g < inputs.nbgames; g++) {
      games.push(buildGame());
    }

    // Connection URL
    let DB_URL = "TYPE THE URL";
    const client = new MongoClient(DB_URL, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    // Connection
    console.log("Openning server");
    await client.connect();
    console.log("Connected correctly to server");
    // Data reset
    const gameCollection = client.db("test").collection("games");
    gameCollection.drop();
    console.log("Collections dropped");

    // Insert games
    console.log("Inserting games");
    console.log(games);
    gameCollection.insertMany(games);

    // Close
    console.log("Closing server");
    //client.close();
  } catch (err) {
    console.log(err.stack);
  }
}

seedDB();
