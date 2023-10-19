require("@jest/globals");
const bcrypt = require("bcrypt");
const contracts = require("./contracts.json");

const {
  objectGenerator,
  userGenerator,
  tableGenerator,
  gameGenerator,
} = require("./dataGenerator");

describe("TEST OF FUNCTION : userGenerator ", () => {
  describe("When no perimeter is provided", () => {
    let user = userGenerator();
    test("then fields are populated by default", () => {
      expect(user.userid).toBeDefined();
      expect(user.pseudo).toBeDefined();
      expect(user.login).toBe(user.pseudo + "@yopmail.com");
      expect(user.password).toBeDefined();
      expect(user.status).toBe("activated");
    });
  });
});

describe("TEST OF FUNCTION : tableGenerator ", () => {
  describe("When no perimeter is provided", () => {
    let table = tableGenerator();
    test("then fields are populated by default", () => {
      expect(table.tableid).toBeDefined();
      expect(table.name).toBeDefined();
      expect(table.name).toBe(table.tableid);
      expect(table.guests).toBe(0);
      expect(table.userids.length).toBe(0);
    });
  });
  describe("When guests perimeter is provided", () => {
    let table = tableGenerator({ guests: { list: [1] } });
    test("then fields are populated by default", () => {
      expect(table.guests).toBe(1);
    });
  });
  describe("When userids perimeter is provided", () => {
    let userids = objectGenerator("user", 4);
    let table = tableGenerator({ userids: { list: [userids] } });
    test("then fields are populated by default", () => {
      expect(table.userids.length).toBe(4);
      expect(table.userids[0].userid).toBeDefined();
    });
  });
});

describe("TEST OF FUNCTION : gameGenerator ", () => {
  describe("When no perimeter is provided", () => {
    let game = gameGenerator();
    test("then fields are populated by default", () => {
      expect(game.gameid).toBeDefined();
      expect(game.tableid).toBeDefined();
      expect(game.tableid).toBe(game.gameid);
      expect(game.date).toBeDefined();
      expect(game.contract).toBe("9plis");
      expect(
        contracts
          .map((c) => {
            return c.key;
          })
          .includes(game.contract),
      ).toBeTruthy();
      expect(game.outcome).toBeDefined();
      expect(game.players.length).toBe(0);
    });
  });
  describe("When tableid perimeter is provided", () => {
    let game = gameGenerator({ tableid: { list: ["123"] } });
    test("then fields are populated by default", () => {
      expect(game.tableid).toBe("123");
    });
  });
  describe("When date perimeter is provided", () => {
    let perimeter = { date: { list: [new Date()] } };
    let game = gameGenerator(perimeter);
    test("then fields are populated by default", () => {
      expect(game.date.toString()).toBe(perimeter.date.list[0].toString());
    });
  });
  describe("When contract perimeter is provided", () => {
    let perimeter = { contract: { list: ["8plis"] } };
    let game = gameGenerator(perimeter);
    test("then fields are populated by default", () => {
      expect(game.contract).toBe("8plis");
    });
  });
  describe("When outcome perimeter is provided", () => {
    let perimeter = { outcome: { list: [-12] } };
    let game = gameGenerator(perimeter);
    test("then fields are populated by default", () => {
      expect(game.outcome).toBe(-12);
    });
  });
  describe("When players perimeter is provided", () => {
    let userids = objectGenerator("user", 4);
    let perimeter = { players: { list: userids, need: 4 } };
    let game = gameGenerator(perimeter);
    let fullContract = contracts.filter((contract) => {
      return contract.key === game.contract;
    })[0];
    test("then 4 players are selected", () => {
      expect(game.players.length).toBe(4);
    });
    test("then attack is consistent with contract", () => {
      expect(
        game.players.filter((player) => {
          return player.role === "attack";
        }).length,
      ).toBe(fullContract.attack);
    });
    test("then defense is consistent with contract", () => {
      expect(
        game.players.filter((player) => {
          return player.role === "defense";
        }).length,
      ).toBe(fullContract.defense);
    });
  });
});

describe("TEST OF FUNCTION : objectGenerator ", () => {
  describe("When generating 10 users", () => {
    let data = objectGenerator("user", 10);
    test("then the corresponding number of users is provided", () => {
      expect(data.length).toBe(10);
    });
  });
  describe("When generating 25 users", () => {
    let data = objectGenerator("user", 25);
    test("then the corresponding number of users is provided", () => {
      expect(data.length).toBe(25);
    });
  });
  describe("When generating 5 tables", () => {
    let data = objectGenerator("table", 5);
    test("then the corresponding number of tables is provided", () => {
      expect(data.length).toBe(5);
    });
  });
  describe("When generating 25 tables", () => {
    let data = objectGenerator("table", 25);
    test("then the corresponding number of tables is provided", () => {
      expect(data.length).toBe(25);
    });
  });
  describe("When generating 15 games", () => {
    let data = objectGenerator("game", 15);
    test("then the corresponding number of games is provided", () => {
      expect(data.length).toBe(15);
    });
  });
  describe("When generating 60 games", () => {
    let data = objectGenerator("game", 60);
    test("then the corresponding number of games is provided", () => {
      expect(data.length).toBe(60);
    });
  });
});
