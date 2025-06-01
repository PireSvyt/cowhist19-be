require("@jest/globals");

var serviceProcessGames = require("./serviceProcessGames.js");

describe("TEST OF FUNCTION : serviceProcessGames ", () => {
  // Invalid contract list
  const invalidContractList = [
    {
      gameid: "",
      tableid: "6458042a032a849f98f08eb6",
      date: Date.now(),
      contracts: [
        {
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
        },
      ],
    },
    {
      gameid: "",
      tableid: "6458042a032a849f98f08eb6",
      date: Date.now() - 15,
      contracts: [
        {
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
        },
      ],
    },
    {
      gameid: "",
      tableid: "6458042a032a849f98f08eb6",
      date: Date.now() - 30,
      contracts: [
        {
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
        },
      ],
    },
  ];
  let invalidResponse = serviceProcessGames(invalidContractList, {
    need: "ranking",
  });
  describe("When a contract is invalid", () => {
    test("then it is neglected from stats", () => {
      expect(invalidResponse.ranking.length).toBe(0);
    });
  });
  // Invalid contract list
  const validContractList = [
    {
      gameid: "",
      tableid: "6458042a032a849f98f08eb6",
      date: Date.now(),
      contracts: [
        {
          contract: "8plis",
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
        },
      ],
    },
    {
      gameid: "",
      tableid: "6458042a032a849f98f08eb6",
      date: Date.now() - 1,
      contracts: [
        {
          contract: "12plis",
          outcome: -3,
          players: [
            {
              userid: "6457f5b9746d3231b7dab2cc",
              role: "attack",
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
              role: "defense",
            },
          ],
        },
      ],
    },
  ];
  let validResponse = serviceProcessGames(validContractList, {
    need: "ranking",
  });
  describe("When the contract list is valid", () => {
    test("then a ranking is provided for each involved players", () => {
      expect(validResponse.ranking.length).toBe(4);
    });
    test("then the player ranking gives the number of games", () => {
      expect(validResponse.ranking[2].games).toBe(2);
    });
    test("then the player ranking gives the attack rate", () => {
      expect(validResponse.ranking[3].rateattack).toBe(0.5);
    });
    test("then the player ranking gives the victory rate", () => {
      expect(validResponse.ranking[2].ratevictory).toBe(0.5);
    });
    test("then the player ranking gives the score (v0)", () => {
      expect(validResponse.ranking[2].scorev0).toBe(5);
    });
  });

  let wrongyearResponse = serviceProcessGames(validContractList, {
    need: "ranking",
    year: 2020,
  });
  describe("When the contract list is valid but the year out of range", () => {
    test("then no ranking is provided", () => {
      expect(wrongyearResponse.ranking.length).toBe(0);
    });
  });
  let nowDate = new Date();
  let nowYear = nowDate.getYear();
  let goodyearResponse = serviceProcessGames(validContractList, {
    need: "ranking",
    year: nowYear + 1900,
  });
  describe("When the contract list is valid and the year is valid", () => {
    test("then the ranking is provided for every players", () => {
      expect(goodyearResponse.ranking.length).toBe(4);
    });
  });
});
