require("@jest/globals");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const authAPI = require("./api/auth.js");
const adminAPI = require("./api/admin.js");
const toolkit = require("../src/resources/toolkit.js");

describe("TEST OF API : auth", () => {
  // Pool of resources
  let users = {
    signedup: {},
    activated: {},
  };

  let adminSignInResponse = undefined;
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
      adminDeleteResponse = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "delete",
            collection: "users",
            match: { userid: { $ne: adminSignInResponse.data.userid } },
          },
        },
        adminSignInResponse.data.token,
      );
      //console.log("adminDeleteResponse", adminDeleteResponse);
      expect(adminDeleteResponse.type).toBe(
        "admin.databasecommand.delete.success",
      );
    });
  });

  describe("Assessment POST apiAuthSignUp", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let rid = toolkit.random_id(16);
      let signUpInputs = {
        login: rid + "@yopmail.com",
        pseudo: rid,
        password: bcrypt.hashSync(rid, 10),
        mailing: "none",
      };
      //console.log("signUpInputs", signUpInputs);
      responses["apiAuthSignUp"] = await authAPI.apiAuthSignUp(signUpInputs);
      //console.log("responses.apiAuthSignUp", responses.apiAuthSignUp);
      expect(responses.apiAuthSignUp.type).toBe("auth.signup.success.signedup");

      // Checks
      responses["check"] = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "get",
            collection: "users",
            condition: {
              field: "userid",
              value: responses.apiAuthSignUp.data.userid,
              filter: "in",
            },
          },
        },
        adminSignInResponse.data.token,
      );
      //console.log("responses.check", responses.check);
      expect(responses.check.type).toBe("admin.databasecommand.get.success");
      expect(responses.check.data.items[0].status).toBe("signedup");
      expect(responses.check.data.items[0].login).toBe(rid + "@yopmail.com");
      //expect(responses.check.data.items[0].password).toBe(rid);
      expect(responses.check.data.items[0].pseudo).toBe(rid);

      // Account for step
      users.signedup[responses.apiAuthSignUp.data.userid] =
        responses.check.data.items[0];
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
    });
    test.skip("unsuccessful: existing login", async () => {
      expect(true).toBe(false);
    });
    test.skip("unsuccessful: existing pseudo", async () => {
      expect(true).toBe(false);
    });
  });

  describe("Assessment POST apiAuthActivate", () => {
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
            condition: {
              field: "userid",
              value: [signupPicked],
              filter: "in",
            },
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

  describe("Assessment POST apiAuthSignIn", () => {
    test("successful without encryption", async () => {
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
    test("successful with encryption", async () => {
      // Prep
      let responses = {};

      // Test
      let activatedPicked = Object.keys(users.activated)[0];
      //console.log("pickedUser", users.activated[activatedPicked]);
      let signInInputs = {
        login: CryptoJS.AES.encrypt(
          users.activated[activatedPicked].login,
          process.env.ENCRYPTION_KEY,
        ).toString(),
        password: CryptoJS.AES.encrypt(
          users.activated[activatedPicked].pseudo,
          process.env.ENCRYPTION_KEY,
        ).toString(),
        encryption: true,
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
