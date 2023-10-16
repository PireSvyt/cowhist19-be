require("@jest/globals");
const authAPI = require("../auth.js");
const adminAPI = require("../admin.js");
const tableAPI = require("../table.js");
const toolkit = require("../../../resources/toolkit.js");

describe("TEST OF API : game", () => {
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
            ids: { $ne: adminSignInResponse.data.id },
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
            ids: { $ne: "" },
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
            ids: { $ne: "" },
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
          items: toolkit.objectGenerator("user", 4, [
            { name: "status", value: "activated" },
          ]),
        },
      };
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
      pickedUser = users[Math.floor(Math.random() * users.length)];
      //console.log("pickedUser", pickedUser);
      let userSignInInputs = {
        login: pickedUser.login,
        password: pickedUser.pseudo,
        encryption: false,
      };
      //console.log("userSignInInputs", userSignInInputs);
      userSignInResponse = await authAPI.apiAuthSignIn(userSignInInputs);
      //console.log("userSignInResponse", userSignInResponse);
      expect(userSignInResponse.type).toBe("auth.signin.success");
    });
  });

  describe("Assessment POST apiTableCreate", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let tableInputs = toolkit.objectGenerator("table");
      tableInputs.users = users.map((u) => {
        return u.id;
      });
      console.log("tableInputs", tableInputs);
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
          ids: [tableInputs.id],
        },
      };
      responses["check"] = await adminAPI.adminDatabaseCommand(
        tableAction,
        adminSignInResponse.data.token,
      );
      console.log(
        "responses.check.data.items[0]",
        responses.check.data.items[0],
      );
      expect(responses.check.type).toBe("admin.databasecommand.get.success");
      // Account for step
      tables.push(responses.check.data.items[0]);
      expect(responses.check.data.items.length).toBe(1);
    });
  });

  describe("Assessment GET apiTableGetDetails", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      console.log("tables[0]", tables[0]);
      console.log("userSignInResponse.data", userSignInResponse.data);
      responses["getDetailsInputs"] = await tableAPI.apiTableGetDetails(
        tables[0].id,
        userSignInResponse.data.token,
      );
      //console.log("responses.getDetailsInputs", responses.getDetailsInputs);
      expect(responses.getDetailsInputs.type).toBe("table.getdetails.success");

      // Checks
      responses["check"] = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "get",
            collection: "users",
            ids: [signupPicked],
          },
        },
        adminSignInResponse.data.token,
      );
      //console.log("responses.check.data", responses.check.data);
      expect(responses.check.type).toBe("admin.databasecommand.get.success");
      expect(responses.check.data.items[0].name).toBe(tables[0].name);
      expect(responses.check.data.items[0].guests).toBe(tables[0].guests);
      expect(responses.check.data.items[0].users.length).toBe(
        tables[0].users.length,
      );
    });
  });
});
