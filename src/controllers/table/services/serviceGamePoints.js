require("dotenv").config();
const contracts = require("../../../resources/contracts.json");

module.exports = function serviceGamePoints(contractToCheck) {
  /*
  
  provides the points for attackants and defenses for a contract
  
  parameters
  * contractToCheck
  
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
    (contract) => contract.key === contractToCheck.contract,
  );
  let contract = contractList[0];
  if (contract === undefined) {
    // If no contract reference
    compliance = false;
    nonCompliances.push("contract not found");
  } else {
    switch (contract.type) {
      case "coop":
        if (contractToCheck.outcome < 0) {
          // Loss case
          attack = -(
            contract.points.base -
            contract.points.fold * contractToCheck.outcome
          );
          defense = -attack;
        } else {
          // Win case
          if (contractToCheck.outcome + contract.folds === 13) {
            // All folds
            attack = contract.points.all;
          } else {
            attack =
              contract.points.base +
              contract.points.fold * contractToCheck.outcome;
          }
        }
        break;
      case "solo":
        if (contractToCheck.outcome < 0) {
          // Loss case
          attack = -(
            contract.points.base -
            contract.points.fold * contractToCheck.outcome
          );
          defense = (-attack / 3) * 2;
        } else {
          // Win case
          attack =
            contract.points.base +
            contract.points.fold * contractToCheck.outcome;
          attack = Math.min(attack, contract.points.max);
        }
        break;
      case "fixed":
        if (contractToCheck.outcome < 0) {
          // Loss case
          attack = -contract.points.attack;
          defense = contract.points.defense;
        } else {
          // Win case
          attack = contract.points.attack;
        }
        break;
      case "trou":
        if (contractToCheck.outcome < 0) {
          // Loss case
          defense = contract.points.attack;
        } else {
          // Win case
          if (contractToCheck.outcome + contract.folds === 13) {
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
