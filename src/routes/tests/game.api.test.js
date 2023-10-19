require("@jest/globals");
const authAPI = require("../api/auth.js");
const adminAPI = require("../api/admin.js");
const gameAPI = require("../api/game.js");
const toolkit = require("../../resources/toolkit.js");
const dataGenerator = require("../../resources/dataGenerator.js");

describe("TEST OF API : game", () => {
  // Pool of resources
  let users = [];
  let table = undefined;
  let games = [];

  let adminSignInResponse = undefined;
  let userSignInResponse = undefined;
  let pickedUser = undefined;

  describe("Assessment admin tools", () => {
    let adminSignInInputs = {
      login: process.env.ADMIN_LOGIN,
      password: process.env.ADMIN_PASSWORD,
      encryption: false,
    };
    //console.log("adminSignInInputs", adminSignInInputs);
    test("successful", async () => {
      adminSignInResponse = await authAPI.apiAuthSignIn(adminSignInInputs);
      //console.log("adminSignInResponse", adminSignInResponse);
      expect(adminSignInResponse.type).toBe("auth.signin.success");
    });
    test("clean up database", async () => {
      adminDeleteUsersResponse = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "delete",
            collection: "users",
            match: { userid: { $ne: adminSignInResponse.data.userid } },
          },
        },
        adminSignInResponse.data.token,
      );
      //console.log("adminDeleteUsersResponse", adminDeleteUsersResponse);
      expect(adminDeleteUsersResponse.type).toBe(
        "admin.databasecommand.delete.success",
      );
      adminDeleteTablesResponse = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "delete",
            collection: "tables",
            match: { tableid: { $ne: "delete all" } },
          },
        },
        adminSignInResponse.data.token,
      );
      //console.log("adminDeleteTablesResponse", adminDeleteTablesResponse);
      expect(adminDeleteTablesResponse.type).toBe(
        "admin.databasecommand.delete.success",
      );
      adminDeleteGamesResponse = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "delete",
            collection: "games",
            match: { gameid: { $ne: "delete all" } },
          },
        },
        adminSignInResponse.data.token,
      );
      //console.log("adminDeleteGamesResponse", adminDeleteGamesResponse);
      expect(adminDeleteGamesResponse.type).toBe(
        "admin.databasecommand.delete.success",
      );
    });
  });

  describe("Assessment set the scene", () => {
    test("set the scene", async () => {
      // Prep
      let responses = {};

      // Users
      let userAction = {
        action: {
          type: "insertmany",
          collection: "users",
          items: dataGenerator.objectGenerator("user", 3, {
            name: { list: ["activated"] },
          }),
        },
      };
      responses["insertUsers"] = await adminAPI.adminDatabaseCommand(
        userAction,
        adminSignInResponse.data.token,
      );
      //console.log("responses.insertUsers", responses.insertUsers);
      expect(responses.insertUsers.type).toBe(
        "admin.databasecommand.insertmany.success",
      );
      users = responses.insertUsers.data;
      //console.log("users", users);
      expect(users.length).toBe(userAction.action.items.length);

      // picked user
      pickedUser = dataGenerator.objectGenerator("user");
      //console.log("pickedUser", pickedUser);
      let pickedUserAction = {
        action: {
          type: "insertmany",
          collection: "users",
          items: [pickedUser],
        },
      };
      responses["insertPickedUser"] = await adminAPI.adminDatabaseCommand(
        pickedUserAction,
        adminSignInResponse.data.token,
      );
      expect(responses.insertPickedUser.type).toBe(
        "admin.databasecommand.insertmany.success",
      );
      users.push(pickedUser);
      let userSignInInputs = {
        login: pickedUser.login,
        password: pickedUser.pseudo,
        encryption: false,
      };
      //console.log("userSignInInputs", userSignInInputs);
      userSignInResponse = await authAPI.apiAuthSignIn(userSignInInputs);
      //console.log("userSignInResponse", userSignInResponse);
      expect(userSignInResponse.type).toBe("auth.signin.success");

      // Table
      let tableAction = {
        action: {
          type: "insertmany",
          collection: "tables",
          items: [
            dataGenerator.objectGenerator("table", 1, {
              userids: { list: users },
            }),
          ],
        },
      };
      //console.log("tableAction", tableAction);
      //console.log("tableAction.action.items[0]", tableAction.action.items[0]);
      responses["insertTable"] = await adminAPI.adminDatabaseCommand(
        tableAction,
        adminSignInResponse.data.token,
      );
      //console.log("responses.insertTable", responses.insertTable);
      expect(responses.insertTable.type).toBe(
        "admin.databasecommand.insertmany.success",
      );
      table = responses.insertTable.data[0];
      //console.log("table", table);
    });
  });

  describe("Assessment POST apiGameCreate", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let gameInputs = dataGenerator.objectGenerator("game");
      delete gameInputs.gameid;
      gameInputs.players = users.map((u) => {
        return { userid: u.userid, role: "ROLE" };
      });
      //console.log("gameInputs", gameInputs);
      responses["apiGameCreate"] = await gameAPI.apiGameCreate(
        gameInputs,
        userSignInResponse.data.token,
      );
      //console.log("responses.apiGameCreate", responses.apiGameCreate);
      expect(responses.apiGameCreate.type).toBe("game.create.success");
      expect(typeof responses.apiGameCreate.data.gameid).toBe("string");

      // Checks
      responses["check"] = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "get",
            collection: "games",
            condition: {
              field: "gameid",
              value: responses.apiGameCreate.data.gameid,
              filter: "in",
            },
          },
        },
        adminSignInResponse.data.token,
      );
      //console.log("responses.check.data", responses.check.data);
      expect(responses.check.type).toBe("admin.databasecommand.get.success");
      expect(responses.check.data.items[0].gameid).toBe(
        responses.apiGameCreate.data.gameid,
      );

      // Account for step
      gameInputs.gameid = responses.apiGameCreate.data.gameid;
      games.push(gameInputs);
    });
  });

  describe.skip("Assessment GET apiGameGet", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // test
      //console.log("games[0].gameid", games[0].gameid);
      responses["apiGameGet"] = await gameAPI.apiGameGet(
        games[0].gameid,
        userSignInResponse.data.token,
      );
      console.log("responses.apiGameGet", responses.apiGameGet);
      expect(responses.apiGameGet.type).toBe("game.get.success");
      expect(responses.apiGameGet.data.game.name).toBe(tables[0].name);
      expect(responses.apiGameGet.data.game.guests).toBe(tables[0].guests);
      expect(responses.apiGameGet.data.game.players.length).toBe(
        tables[0].userids.length,
      );
      expect(
        responses.apiGameGet.data.game.contracts.length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Assessment POST apiGameDelete", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      //console.log("games[0].gameid", games[0].gameid);
      responses["apiGameDelete"] = await gameAPI.apiGameDelete(
        games[0].gameid,
        userSignInResponse.data.token,
      );
      //console.log("responses.apiGameDelete", responses.apiGameDelete);
      expect(responses.apiGameDelete.type).toBe("game.delete.success");

      // Account for step
      delete games[0];
    });
  });
});
