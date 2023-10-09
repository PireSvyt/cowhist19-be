require("dotenv").config();
const contracts = require("../../../resources/contracts.json");

module.exports = function serviceGamePoints(game) {
  /*
  
  provides the points for attackants and defenses for a game
  
  parameters
  * game
  
  */

  if (process.env.DEBUG === true) {
    console.log("table.serviceGamePoints");
  }

  // Initialize
  let compliance = true;
  let nonCompliances = [];
  let attack = 0;
  let defense = 0;

  // Find the contract requirements
  let contractList = contracts.filter(
    (contract) => contract.key === game.contract,
  );
  let contract = contractList[0];
  if (contract === undefined) {
    // If no contract reference
    compliance = false;
    nonCompliances.push("contract not found");
  } else {
    switch (contract.type) {
      case "coop":
        if (game.outcome < 0) {
          // Loss case
          attack = -(
            contract.points.base -
            contract.points.fold * game.outcome
          );
          defense = -attack;
        } else {
          // Win case
          if (game.outcome + contract.folds === 13) {
            // All folds
            attack = contract.points.all;
          } else {
            attack = contract.points.base + contract.points.fold * game.outcome;
          }
        }
        break;
      case "solo":
        if (game.outcome < 0) {
          // Loss case
          attack = -(
            contract.points.base -
            contract.points.fold * game.outcome
          );
          defense = (-attack / 3) * 2;
        } else {
          // Win case
          attack = contract.points.base + contract.points.fold * game.outcome;
          attack = Math.min(attack, contract.points.max);
        }
        break;
      case "fixed":
        if (game.outcome < 0) {
          // Loss case
          attack = -contract.points.attack;
          defense = contract.points.defense;
        } else {
          // Win case
          attack = contract.points.attack;
        }
        break;
      case "trou":
        if (game.outcome < 0) {
          // Loss case
          defense = contract.points.attack;
        } else {
          // Win case
          if (game.outcome + contract.folds === 13) {
            attack = contract.points.all;
          } else {
            attack = contract.points.attack;
          }
        }
        break;
      default:
        compliance = false;
        nonCompliances.push("contract type undefined");
    }
  }

  return {
    compliance: compliance,
    nonCompliances: nonCompliances,
    attack: attack,
    defense: defense,
  };
};
