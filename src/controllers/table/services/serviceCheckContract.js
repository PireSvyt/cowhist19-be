const contracts = require("../resources/contracts.json");

function serviceCheckContract(game) {
  /*
  
  check that a game matches with contract
  
  parameters
  * game to be checked
  
  */

  console.log("table.serviceCheckContract");

  // Initialize
  let compliance = true;
  let nonCompliances = [];

  // Find the contract requirements
  let contractList = contracts.filter(
    (contract) => contract.key === game.contract
  );
  let contract = contractList[0];
  if (contract === undefined) {
    // If no contract reference
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

  return compliance;
}

module.exports = { serviceCheckContract };
