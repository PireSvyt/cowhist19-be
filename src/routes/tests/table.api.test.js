require("@jest/globals");
const authAPI = require("../api/auth.js");
const adminAPI = require("../api/admin.js");
const tableAPI = require("../api/table.js");
const toolkit = require("../../resources/toolkit.js");
const dataGenerator = require("../../resources/dataGenerator.js");

describe("TEST OF API : table", () => {
  // Pool of resources
  let users = [];
  let tables = [];
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
    // Prep
    let responses = {};
    test("set users", async () => {
      // Users
      let userAction = {
        action: {
          type: "insertmany",
          collection: "users",
          items: dataGenerator.objectGenerator("user", 3),
        },
      };
      //console.log("userAction", userAction);
      responses["insertUsers"] = await adminAPI.adminDatabaseCommand(
        userAction,
        adminSignInResponse.data.token,
      );
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
      /*console.log(
        "responses.insertPickedUser.data[0]",
        responses.insertPickedUser.data[0],
      );*/
      expect(responses.insertPickedUser.type).toBe(
        "admin.databasecommand.insertmany.success",
      );
      users.push(responses.insertPickedUser.data[0]);
      // Signin
      let userSignInInputs = {
        login: pickedUser.login,
        password: pickedUser.pseudo,
        encryption: false,
      };
      //console.log("userSignInInputs", userSignInInputs);
      userSignInResponse = await authAPI.apiAuthSignIn(userSignInInputs);
      //console.log("userSignInResponse", userSignInResponse);
      expect(userSignInResponse.type).toBe("auth.signin.success");

      //console.log("users", users);
    });
  });

  describe("Assessment POST apiTableCreate", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let tableInputs = dataGenerator.objectGenerator("table", 1, {
        userids: { list: users },
      });
      //console.log("tableInputs", tableInputs);
      responses["apiTableCreate"] = await tableAPI.apiTableCreate(
        tableInputs,
        userSignInResponse.data.token,
      );
      //console.log("responses.apiTableCreate", responses.apiTableCreate);
      expect(responses.apiTableCreate.type).toBe("table.create.success");

      // Checks
      let tableAction = {
        action: {
          type: "get",
          collection: "tables",
          condition: {
            field: "tableid",
            value: tableInputs.tableid,
            filter: "in",
          },
        },
      };
      //console.log("tableAction", tableAction);
      responses["check"] = await adminAPI.adminDatabaseCommand(
        tableAction,
        adminSignInResponse.data.token,
      );
      /*console.log("responses.check", responses.check);
      console.log(
        "responses.check.data.items[0]",
        responses.check.data.items[0],
      );*/
      expect(responses.check.type).toBe("admin.databasecommand.get.success");
      expect(responses.check.data.items.length).toBe(1);
      expect(responses.check.data.items[0].userids.length).toBe(users.length);
      expect(
        responses.check.data.items[0].userids.includes(pickedUser.userid),
      ).toBeTruthy();
      expect(responses.check.data.items[0].guests).toBe(0);
      // Account for step
      tables.push(responses.check.data.items[0]);
      //console.log("tables", tables);
    });
  });

  describe("Assessment GET apiTableGetDetails", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      //console.log("tables[0]", tables[0]);
      responses["getDetails"] = await tableAPI.apiTableGetDetails(
        tables[0].tableid,
        userSignInResponse.data.token,
      );
      //console.log("responses.getDetails", responses.getDetails);
      expect(responses.getDetails.type).toBe("table.getdetails.success");
      expect(responses.getDetails.data.table.name).toBe(tables[0].name);
      expect(responses.getDetails.data.table.guests).toBe(tables[0].guests);
      expect(responses.getDetails.data.table.players.length).toBe(
        tables[0].userids.length,
      );
      expect(
        responses.getDetails.data.table.contracts.length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Assessment POST apiTableGetStats", () => {
    // Prep
    let responses = {};
    describe("When no game have been played", () => {
      test("Then tablestats ranking is empty", async () => {
        // Test
        let tableToGet = tables[0];
        //console.log("tableToGet", tableToGet);
        let statsParameters = { need: "ranking" };
        responses["apiTableGetStatsRankingEmpty"] =
          await tableAPI.apiTableGetStats(
            tableToGet.tableid,
            statsParameters,
            userSignInResponse.data.token,
          );
        //console.log("responses.apiTableGetStatsRankingEmpty", responses.apiTableGetStatsRankingEmpty);
        expect(responses.apiTableGetStatsRankingEmpty.type).toBe(
          "table.getstats.success",
        );
        expect(
          responses.apiTableGetStatsRankingEmpty.data.stats.ranking.length,
        ).toBe(0);

        // Checks
      });
    });
    describe("When some games have been played", () => {
      test("Then tablestats ranking is available", async () => {
        // Prep
        let responses = {};
        let gameAction = {
          action: {
            type: "insertmany",
            collection: "games",
            items: dataGenerator.objectGenerator("game", 10, {
              tableid: { list: [tables[0].tableid] },
              players: { list: users },
            }),
          },
        };
        //console.log("gameAction", gameAction);
        //console.log("gameAction.action.items[0]", gameAction.action.items[0]);
        responses["insertGames"] = await adminAPI.adminDatabaseCommand(
          gameAction,
          adminSignInResponse.data.token,
        );
        //console.log("responses.insertGames", responses.insertGames);
        expect(responses.insertGames.type).toBe(
          "admin.databasecommand.insertmany.success",
        );
        expect(responses.insertGames.data.length).toBe(
          gameAction.action.items.length,
        );
        games = responses.insertGames.data;
        //console.log("game0", games[0]);

        // Test
        let tableToGet = tables[0];
        //console.log("tableToGet", tableToGet);
        let statsParameters = { need: "ranking" }; //"ranking" OR "graph" + "field" information
        responses["apiTableGetStatsRanking"] = await tableAPI.apiTableGetStats(
          tableToGet.tableid,
          statsParameters,
          userSignInResponse.data.token,
        );
        /*console.log(
          "responses.apiTableGetStatsRanking",
          responses.apiTableGetStatsRanking,
        );*/
        expect(responses.apiTableGetStatsRanking.type).toBe(
          "table.getstats.success",
        );
        expect(
          responses.apiTableGetStatsRanking.data.stats.ranking.length,
        ).toBe(4);

        // Checks
      });
    });
  });

  describe("Assessment POST apiTableGetHistory", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let tableToGet = tables[0];
      //console.log("tableToGet", tableToGet);
      let historyParameters = { need: "list" };
      responses["apiTableGetHistory"] = await tableAPI.apiTableGetHistory(
        tableToGet.tableid,
        historyParameters,
        userSignInResponse.data.token,
      );
      console.log("responses.apiTableGetHistory", responses.apiTableGetHistory);
      expect(responses.apiTableGetHistory.type).toBe(
        "table.gethistory.success",
      );

      // Checks
    });
  });

  describe("Assessment POST apiTableSave", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let tableToSave = tables[0];
      tableToSave.guests = 1;
      let shortenedUserids = tableToSave.userids.filter((u) => {
        return u !== userSignInResponse.data.userid;
      });
      shortenedUserids.pop();
      shortenedUserids.push(userSignInResponse.data.userid);
      tableToSave.userids = shortenedUserids;
      //console.log("tableToSave", tableToSave);
      responses["tableSaveInputs"] = await tableAPI.apiTableSave(
        tableToSave,
        userSignInResponse.data.token,
      );
      //console.log("responses.tableSaveInputs", responses.tableSaveInputs);
      expect(responses.tableSaveInputs.type).toBe(
        "table.save.success.modified",
      );

      // Checks
      responses["check"] = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "get",
            collection: "tables",
            condition: {
              field: "tableid",
              value: tableToSave.tableid,
              filter: "in",
            },
          },
        },
        adminSignInResponse.data.token,
      );
      //console.log("responses.check.data", responses.check.data);
      expect(responses.check.type).toBe("admin.databasecommand.get.success");
      expect(responses.check.data.items[0].guests).toBe(tableToSave.guests);
      expect(responses.check.data.items[0].userids.length).toBe(
        tableToSave.userids.length,
      );
      tables[0] = responses.check.data.items[0];
    });
  });

  describe("Assessment DELETE apiTableDelete", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let tableToDelete = tables[0];
      //console.log("tableToDelete", tableToDelete);
      responses["apiTableDelete"] = await tableAPI.apiTableDelete(
        tableToDelete.tableid,
        userSignInResponse.data.token,
      );
      //console.log("responses.apiTableDelete", responses.apiTableDelete);
      expect(responses.apiTableDelete.type).toBe("table.delete.success");

      // Checks
      responses["check"] = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "get",
            collection: "tables",
            condition: {
              field: "tableid",
              value: tableToDelete.tableid,
              filter: "in",
            },
          },
        },
        adminSignInResponse.data.token,
      );
      //console.log("tableToDelete.tableid", tableToDelete.tableid);
      //console.log("responses.check.data", responses.check.data);
      expect(responses.check.type).toBe(
        "admin.databasecommand.get.error.partialmatch",
      );
      expect(responses.check.data.items.length).toBe(0);
    });
  });
});
