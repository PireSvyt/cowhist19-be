require("@jest/globals");

var serviceProcessGames = require("./serviceProcessGames.js");

describe("TEST OF FUNCTION : serviceProcessGames ", () => {
  // Invalid contract list
  const invalidContractList = [
    {
      _id: "",
      table: "6458042a032a849f98f08eb6",
      contract: "12plis",
      outcome: 3,
      players: [
        {
          _id: "6457f5b9746d3231b7dab2cc",
          role: "defense",
        },
        {
          _id: "64580468032a849f98f08ebc",
          role: "attack",
        },
        {
          _id: "64580511032a849f98f08ec9",
          role: "defense",
        },
        {
          _id: "64580531032a849f98f08ed0",
          role: "attack",
        },
      ],
    },
    {
      _id: "",
      table: "6458042a032a849f98f08eb6",
      contract: "8plis",
      outcome: -1,
      players: [
        {
          _id: "6457f5b9746d3231b7dab2cc",
          role: "defense",
        },
        {
          _id: "64580511032a849f98f08ec9",
          role: "defense",
        },
        {
          _id: "64580531032a849f98f08ed0",
          role: "attack",
        },
      ],
    },
    {
      _id: "",
      table: "6458042a032a849f98f08eb6",
      contract: "8plis",
      outcome: -1,
      players: [
        {
          _id: "6457f5b9746d3231b7dab2cc",
          role: "defense",
        },
        {
          _id: "64580511032a849f98f08ec9",
          role: "attack",
        },
        {
          _id: "64580531032a849f98f08ed0",
          role: "attack",
        },
      ],
    },
  ];
  describe("When a contract is invalid", () => {
    test("then it is neglected from stats", () => {
      let serviceResponse = serviceProcessGames(invalidContractList);
      expect(serviceResponse.ranking.length).toBe(0);
    });
  });
  // Invalid contract list
  const validContractList = [
    {
      _id: "",
      table: "6458042a032a849f98f08eb6",
      contract: "8plis",
      outcome: 3,
      players: [
        {
          _id: "6457f5b9746d3231b7dab2cc",
          role: "defense",
        },
        {
          _id: "64580468032a849f98f08ebc",
          role: "attack",
        },
        {
          _id: "64580511032a849f98f08ec9",
          role: "defense",
        },
        {
          _id: "64580531032a849f98f08ed0",
          role: "attack",
        },
      ],
    },
    {
      _id: "",
      table: "6458042a032a849f98f08eb6",
      contract: "12plis",
      outcome: -3,
      players: [
        {
          _id: "6457f5b9746d3231b7dab2cc",
          role: "attack",
        },
        {
          _id: "64580468032a849f98f08ebc",
          role: "attack",
        },
        {
          _id: "64580511032a849f98f08ec9",
          role: "defense",
        },
        {
          _id: "64580531032a849f98f08ed0",
          role: "defense",
        },
      ],
    },
  ];
  describe("When the contract list is valid", () => {
    test("then a ranking is provided for each involved players", () => {
      let serviceResponse = serviceProcessGames(validContractList);
      expect(serviceResponse.ranking.length).toBe(4);
    });
    test("then the player ranking gives the number of games", () => {
      let serviceResponse = serviceProcessGames(validContractList);
      expect(serviceResponse.ranking[2].games).toBe(2);
    });
    test("then the player ranking gives the attack rate", () => {
      let serviceResponse = serviceProcessGames(validContractList);
      expect(serviceResponse.ranking[3].rateattack).toBe(0.5);
    });
    test("then the player ranking gives the victory rate", () => {
      let serviceResponse = serviceProcessGames(validContractList);
      expect(serviceResponse.ranking[2].ratevictory).toBe(0.5);
    });
    test("then the player ranking gives the score (v0)", () => {
      let serviceResponse = serviceProcessGames(validContractList);
      expect(serviceResponse.ranking[2].scorev0).toBe(5);
    });
  });
});
