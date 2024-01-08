require("dotenv").config();

const serviceCheckContract = require("../../table/services/serviceCheckContract.js");

module.exports = function serviceProcessGames(games, userid) {
  /*
  
  process the game list to provide user statistics
  
  parameters
  * games to be processed
  * userid to process games for a given user
  
  */

  if (process.env.DEBUG) {
    console.log("user.serviceProcessGames");
  }

  // Initialize
  let stats = {
    games: games.length,
    contracts: 0,
    attack: 0,
    rateattack: 0,
    victory: 0,
    ratevictory: 0,
  };

  if (stats.games > 0) {
    // Summarize game outcomes
    games.forEach((game) => {
      game.contracts.forEach((contract) => {
        if (serviceCheckContract(contract)) {
          stats.contracts = stats.contracts + 1;
          // Attack
          let player = contract.players.filter(
            (gameplayer) => gameplayer.userid === userid,
          )[0];
          if (player.role === "attack") {
            stats.attack = stats.attack + 1;
            if (contract.outcome >= 0) {
              stats.victory = stats.victory + 1;
            }
          } else {
            if (contract.outcome < 0) {
              stats.victory = stats.victory + 1;
            }
          }
        }
      });
    });

    // Compute rates
    stats.rateattack = stats.attack / stats.contracts;
    stats.ratevictory = stats.victory / stats.contracts;
  }

  // Neater response
  delete stats.attack;
  delete stats.victory;

  return stats;
};
