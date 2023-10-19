require("@jest/globals");
const authAPI = require("../api/auth.js");
const adminAPI = require("../api/admin.js");
const userAPI = require("../api/user.js");
const toolkit = require("../../resources/toolkit.js");
const dataGenerator = require("../../resources/dataGenerator.js");

describe("TEST OF API : user", () => {
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
    test("set the scene", async () => {
      // Prep
      let responses = {};

      // Users
      let userAction = {
        action: {
          type: "insertmany",
          collection: "users",
          items: dataGenerator.objectGenerator("user", 3, [
            { name: "status", value: "activated" },
          ]),
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
          items: dataGenerator.objectGenerator("table", 1, [
            {
              name: "userids",
              value: users.map((item) => {
                return item.userid;
              }),
            },
          ]),
        },
      };
      //console.log("tableAction", tableAction);
      //console.log("tableAction.action.items", tableAction.action.items);
      responses["insertTables"] = await adminAPI.adminDatabaseCommand(
        tableAction,
        adminSignInResponse.data.token,
      );
      expect(responses.insertTables.type).toBe(
        "admin.databasecommand.insertmany.success",
      );
      tables = responses.insertTables.data;
      //console.log("tables", tables);

      // Games
      let gameAction = {
        action: {
          type: "insertmany",
          collection: "games",
          items: dataGenerator.objectGenerator(
            "game",
            5,
            [
              {
                name: "tableid",
                value: tables[0].tableid,
              },
            ],
            {
              players: users,
            },
          ),
        },
      };
      //console.log("gameAction", gameAction);
      //console.log("gameAction.action.items[0]", gameAction.action.items[0]);
      responses["insertGames"] = await adminAPI.adminDatabaseCommand(
        gameAction,
        adminSignInResponse.data.token,
      );
      expect(responses.insertGames.type).toBe(
        "admin.databasecommand.insertmany.success",
      );
      games = responses.insertGames.data;
      //console.log("game0", games[0]);
    });
  });

  describe("Assessment POST apiUserGetDetails", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      responses["apiUserGetDetails"] = await userAPI.apiUserGetDetails(
        userSignInResponse.data.token,
      );
      console.log("responses.apiUserGetDetails", responses.apiUserGetDetails);
      expect(responses.apiUserGetDetails.type).toBe("user.getdetails.success");

      // checks
      expect(responses.apiUserGetDetails.data.user.userid).toBe(
        pickedUser.userid,
      );
      expect(responses.apiUserGetDetails.data.user.pseudo).toBe(
        pickedUser.pseudo,
      );
      expect(responses.apiUserGetDetails.data.user.login).toBe(
        pickedUser.login,
      );
      expect(responses.apiUserGetDetails.data.user.status).toBe(
        pickedUser.status,
      );
      expect(
        responses.apiUserGetDetails.data.user.tables
          .map((table) => {
            return table.tableid;
          })
          .includes(tables[0].tableid),
      ).toBeTruthy();
    });
  });
});
