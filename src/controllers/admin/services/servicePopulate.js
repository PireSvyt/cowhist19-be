const MongoClient = require("mongodb").MongoClient;
var {
  adjustProbabilities,
  pickOne,
  getLastDates,
} = require("../../../resources/toolkit.js");
const contracts = require("../../../resources/contracts.json");

module.exports = async function servicePopulate(reqInputs) {
  /*
  
  populate the database with mocked data
  
  */

  console.log("admin.servicePopulate");

  return new Promise((resolve, reject) => {
    let allWentWell = true;

    // Inputs
    const inputs = {
      tableid: "6d6f636b65647461626c6531",
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
          "by-1": { likelihood: 0.3, folds: -1 },
          "by+0": { likelihood: 0.4, folds: 0 },
          "by+1": { likelihood: 0.15, folds: 1 },
          "by+2": { likelihood: 0.05, folds: 2 },
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
    // Inputs adjustment per request
    if (reqInputs !== undefined) {
      if (reqInputs.weeks !== undefined) {
        inputs.weeks = reqInputs.weeks;
      }
      if (reqInputs.nbgames !== undefined) {
        inputs.nbgames = reqInputs.nbgames;
      }
    }

    // Adjusting likelihoods
    console.log("Adjusting likelihoods");
    // Adjust contract likelihoods
    //console.log("Adjusting contacts");
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
    //console.log("adjustedContracts");
    //console.log(adjustedContracts);
    // Adjust outcome likelihood
    //console.log("Adjusting outcomes");
    let adjustedOutcomes = adjustProbabilities(
      inputs.likelihood.outcomes,
      "likelihood"
    );
    //console.log("adjustedOutcomes");
    //console.log(adjustedOutcomes);
    // Adjust player likelihood
    //console.log("Adjusting playuers");
    let adjustedPlayers = adjustProbabilities(inputs.likelihood.players);
    //console.log("adjustedPlayers");
    //console.log(adjustedPlayers);
    // Adjust date likelihood
    //console.log("Adjusting dates");
    let adjustedWeekdays = adjustProbabilities(inputs.likelihood.days);
    //console.log("adjustedWeekdays");
    //console.log(adjustedWeekdays);
    let candidateDates = getLastDates(inputs.weeks * 7, adjustedWeekdays);
    let adjustedDates = adjustProbabilities(candidateDates, "likelihood");
    //console.log("adjustedDates");
    //console.log(adjustedDates);

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
          _id: attackant,
          role: "attack",
        });
      });
      // Defense
      let defenseCandidates = adjustProbabilities(
        Object.fromEntries(
          Object.entries(inputs.likelihood.players).filter(([key, value]) => {
            return !attack.includes(key);
          })
        )
      );
      let defense = [];
      for (let p = 1; p <= adjustedContracts[contractId].defense; p++) {
        defense.push(pickOne(defenseCandidates));
      }
      defense.forEach((defenser) => {
        players.push({
          _id: defenser,
          role: "defense",
        });
      });
      // Date
      let date = adjustedDates[pickOne(adjustedDates, "likelihood")].date;

      // build resulting game
      let game = {
        table: inputs.tableid,
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

    // DB connection
    console.log("Openning server");
    let DB_URL =
      "mongodb+srv://savoyatp:2PDJ9d6PrWEcPD8t@cluster0.0gnwxga.mongodb.net/?retryWrites=true&w=majority";
    let mongoClient = new MongoClient();
    mongoClient
      .connect(DB_URL, { useNewUrlParser: true })
      .then((err) => {
        console.log("Connected correctly to server");

        // Data reset
        const gameCollection = mongoClient.db("test").collection("games");
        gameCollection.drop();
        console.log("Collections dropped");

        // Insert games
        console.log("Inserting games");
        //console.log(games);
        gameCollection.insertMany(games);

        mongoClient.close();

        // Outcome
        if (allWentWell) {
          resolve({
            outcome: "success",
          });
        } else {
          resolve({
            outcome: "error",
            error: "all went not well",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        resolve({
          outcome: "error",
          error: err,
        });
      });

    // Outcome
    resolve({
      outcome: "error",
      error: "db connection failed",
    });
  });
};
