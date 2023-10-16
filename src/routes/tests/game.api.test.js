require("@jest/globals");
const authAPI = require("../api/auth.js");
const adminAPI = require("../api/admin.js");
const gameAPI = require("../api/game.js");
const toolkit = require("../../resources/toolkit.js");

describe.skip("TEST OF API : game", () => {
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
            ids: { $ne: adminSignInResponse.data.userid },
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
      console.log("responses.insertUsers", responses.insertUsers);
      expect(responses.insertUsers.type).toBe(
        "admin.databasecommand.insertmany.success",
      );
      users = responses.insertUsers.data;
      //console.log("users", users);
      expect(users.length).toBe(userAction.action.items.length);

      // Table
      let tableAction = {
        action: {
          type: "insertmany",
          collection: "tables",
          items: toolkit.objectGenerator("table", 1, [
            {
              name: "users",
              value: users.map((item) => {
                return item.userid;
              }),
            },
          ]),
        },
      };
      responses["insertTable"] = await adminAPI.adminDatabaseCommand(
        tableAction,
        adminSignInResponse.data.token,
      );
      expect(responses.insertTable.type).toBe(
        "admin.databasecommand.insertmany.success",
      );
      table = responses.insertTable.data[0];
      //console.log("table", table);

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

  describe("Assessment POST apiGameSave", () => {
    test.skip("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let gameInputs = toolkit.objectGenerator("game");
      delete gameInputs.gameid;
      //console.log("gameInputs", gameInputs);
      responses["apiGameSave"] = await gameAPI.apiGameSave(
        gameInputs,
        pickedUser.token,
      );
      console.log("responses.apiGameSave", responses.apiGameSave);
      expect(responses.apiGameSave.type).toBe("game.save.success");

      // Checks
      responses["check"] = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "get",
            collection: "games",
            ids: [gameInputs.gameid],
          },
        },
        adminSignInResponse.data.token,
      );
      console.log("responses.check.data", responses.check.data);
      expect(responses.check.type).toBe("admin.databasecommand.get.success");

      // Account for step
      games.push(responses.check.data.items[0]);
    });
    test.skip("successful: already signedup", async () => {
      // Prep
      let responses = {};

      // Test
      let rid = toolkit.random_id(16);
      let first_signUpInputs = {
        login: rid + "@yopmail.com",
        pseudo: rid,
        password: rid,
      };
      //console.log("first_signUpInputs", first_signUpInputs);
      responses["first_apiAuthSignUp"] =
        await authAPI.apiAuthSignUp(first_signUpInputs);
      //console.log("responses.first_apiAuthSignUp", responses.first_apiAuthSignUp);
      let second_signUpInputs = {
        login: first_signUpInputs.login,
        pseudo: toolkit.random_id(),
        password: toolkit.random_id(),
      };
      //console.log("second_signUpInputs", second_signUpInputs);
      responses["second_apiAuthSignUp"] =
        await authAPI.apiAuthSignUp(second_signUpInputs);
      //console.log("responses.second_apiAuthSignUp", responses.second_apiAuthSignUp);
      expect(responses.second_apiAuthSignUp.type).toBe(
        "auth.signup.success.alreadysignedup",
      );

      // Clean
      responses["testServices"] = await adminAPI.adminDatabaseCommand([
        {
          type: "delete",
          collection: "users",
          ids: [responses.first_apiAuthSignUp.data.userid],
        },
      ]);
      //console.log("responses.testServices", responses.testServices);
    });
    test.skip("unsuccessful: existing login", async () => {
      expect(true).toBe(false);
    });
    test.skip("unsuccessful: existing pseudo", async () => {
      expect(true).toBe(false);
    });
  });

  describe.skip("Assessment POST apiGameDelete", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let signupPicked = Object.keys(users.signedup)[0];
      //console.log("pickedUser", users.signedup[signupPicked]);
      let activateInputs = {
        login: users.signedup[signupPicked].login,
        token: users.signedup[signupPicked].activationtoken,
      };
      //console.log("activateInputs", activateInputs);
      responses["apiAuthActivate"] =
        await authAPI.apiAuthActivate(activateInputs);
      //console.log("responses.apiAuthActivate", responses.apiAuthActivate);
      expect(responses.apiAuthActivate.type).toBe(
        "auth.activate.success.activated",
      );

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
      expect(responses.check.data.items[0].status).toBe("activated");
      expect(responses.check.data.items[0].login).toBe(
        users.signedup[signupPicked].login,
      );
      expect(responses.check.data.items[0].password).toBe(
        users.signedup[signupPicked].password,
      );
      expect(responses.check.data.items[0].pseudo).toBe(
        users.signedup[signupPicked].pseudo,
      );

      // Account for step
      delete users.signedup[signupPicked];
      users.activated[signupPicked] = responses.check.data.items[0];
    });
    test.skip("unsuccessful: not existing", async () => {
      expect(true).toBe(false);
    });
    test.skip("unsuccessful: wrong token", async () => {
      expect(true).toBe(false);
    });
    test.skip("unsuccessful: already activated", async () => {
      expect(true).toBe(false);
    });
  });

  describe.skip("Assessment POST apiGameSave", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let activatedPicked = Object.keys(users.activated)[0];
      //console.log("pickedUser", users.activated[activatedPicked]);
      let signInInputs = {
        login: users.activated[activatedPicked].login,
        password: users.activated[activatedPicked].pseudo,
        encryption: false,
      };
      //console.log("signInInputs", signInInputs);
      responses["apiAuthSignIn"] = await authAPI.apiAuthSignIn(signInInputs);
      //console.log("responses.apiAuthSignIn", responses.apiAuthSignIn);
      expect(responses.apiAuthSignIn.type).toBe("auth.signin.success");

      // checks
    });
    test.skip("unsuccessful: not existing", async () => {
      expect(true).toBe(false);
    });
    test.skip("unsuccessful: not activated", async () => {
      expect(true).toBe(false);
    });
    test.skip("unsuccessful: wrong password", async () => {
      expect(true).toBe(false);
    });
  });
});
