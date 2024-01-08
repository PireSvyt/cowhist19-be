require("@jest/globals");

var serviceCheckContract = require("./serviceCheckContract.js");

describe("TEST OF FUNCTION : serviceCheckContract ", () => {
  // Valid contract
  const validContract = {
    gameid: "",
    tableid: "6458042a032a849f98f08eb6",
    contract: "8plis",
    outcome: 1,
    players: [
      {
        userid: "6457f5b9746d3231b7dab2cc",
        role: "defense",
      },
      {
        userid: "64580468032a849f98f08ebc",
        role: "attack",
      },
      {
        userid: "64580511032a849f98f08ec9",
        role: "defense",
      },
      {
        userid: "64580531032a849f98f08ed0",
        role: "attack",
      },
    ],
  };
  describe("When a contract is valid", () => {
    test("then the outcome is true", () => {
      let serviceResponse = serviceCheckContract(validContract);
      expect(serviceResponse).toBeTruthy();
    });
  });
  // Exceeding folds
  const exceedingFoldsContract = {
    gameid: "",
    tableid: "6458042a032a849f98f08eb6",
    contract: "12plis",
    outcome: 3,
    players: [
      {
        userid: "6457f5b9746d3231b7dab2cc",
        role: "defense",
      },
      {
        userid: "64580468032a849f98f08ebc",
        role: "attack",
      },
      {
        userid: "64580511032a849f98f08ec9",
        role: "defense",
      },
      {
        userid: "64580531032a849f98f08ed0",
        role: "attack",
      },
    ],
  };
  describe("When the number of folds exceeds 13", () => {
    test("then the outcome is false", () => {
      let serviceResponse = serviceCheckContract(exceedingFoldsContract);
      expect(serviceResponse).toBeFalsy();
    });
  });
  // Invalid attack list
  const invalidAttackContract = {
    gameid: "",
    tableid: "6458042a032a849f98f08eb6",
    contract: "8plis",
    outcome: -1,
    players: [
      {
        userid: "6457f5b9746d3231b7dab2cc",
        role: "defense",
      },
      {
        userid: "64580511032a849f98f08ec9",
        role: "defense",
      },
      {
        userid: "64580531032a849f98f08ed0",
        role: "attack",
      },
    ],
  };
  describe("When the attack is not well formed", () => {
    test("then the outcome is false", () => {
      let serviceResponse = serviceCheckContract(invalidAttackContract);
      expect(serviceResponse).toBeFalsy();
    });
  });
  // Invalid defense list
  const invalidDefenseContract = {
    gameid: "",
    tableid: "6458042a032a849f98f08eb6",
    contract: "8plis",
    outcome: -1,
    players: [
      {
        userid: "6457f5b9746d3231b7dab2cc",
        role: "defense",
      },
      {
        userid: "64580511032a849f98f08ec9",
        role: "attack",
      },
      {
        userid: "64580531032a849f98f08ed0",
        role: "attack",
      },
    ],
  };
  describe("When the defense is not well formed", () => {
    test("then the outcome is false", () => {
      let serviceResponse = serviceCheckContract(invalidDefenseContract);
      expect(serviceResponse).toBeFalsy();
    });
  });
});
