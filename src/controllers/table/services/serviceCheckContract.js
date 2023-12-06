require("dotenv").config();
const contracts = require("../../../resources/contracts.json");

module.exports = function serviceCheckContract(contractToCheck) {
  /*
  
  check that a contract meets requirements
  
  parameters
  * contractToCheck to be checked
  
  */

  if (process.env.DEBUG === true) {
    console.log("table.serviceCheckContract");
  }

  // Initialize
  let compliance = true;
  let nonCompliances = [];

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
    // Attack
    if (
      contractToCheck.players.filter((player) => player.role === "attack")
        .length !== contract.attack
    ) {
      compliance = false;
      nonCompliances.push("number of attackant(s) does not match");
    }

    // Defense
    if (
      contractToCheck.players.filter((player) => player.role === "defense")
        .length !== contract.defense
    ) {
      compliance = false;
      nonCompliances.push("number of defender(s) does not match");
    }

    // Folds
    if (contractToCheck.outcome + contract.folds > 13) {
      compliance = false;
      nonCompliances.push("number of folds won exceeds possibilities");
    }
    if (contractToCheck.outcome < -13) {
      compliance = false;
      nonCompliances.push("number of folds lost exceeds possibilities");
    }
  }

  return compliance;
};
