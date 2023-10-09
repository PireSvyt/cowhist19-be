require("@jest/globals");
const authAPI = require("../auth.js");
const adminAPI = require("../admin.js");
const toolkit = require("../../../resources/toolkit.js");

describe("TEST OF API : auth", () => {
  describe("Assessment POST apiAuthSignUp", () => {
    test("successful", async () => {
      // Prep
      let responses = {};

      // Test
      let rid = toolkit.random_id(16);
      let signUpInputs = {
        login: rid + "@yopmail.com",
        pseudo: rid,
        password: rid,
      };
      //console.log("signUpInputs", signUpInputs);
      responses["apiAuthSignUp"] = await authAPI.apiAuthSignUp(signUpInputs);
      //console.log("responses.apiAuthSignUp", responses.apiAuthSignUp);
      expect(responses.apiAuthSignUp.type).toBe("auth.signup.success.signedup");

      // Checks
      let adminSignInInputs = {
        login: process.env.ADMIN_LOGIN,
        password: process.env.ADMIN_PASSWORD,
        encryption: false,
      };
      //console.log("adminSignInInputs", adminSignInInputs);
      responses["adminSignInResponse"] =
        await authAPI.apiAuthSignIn(adminSignInInputs);
      /*console.log(
        "responses.adminSignInResponse",
        responses.adminSignInResponse,
      );*/
      responses["check"] = await adminAPI.adminDatabaseCommand(
        {
          action: {
            type: "get",
            collection: "users",
            ids: [responses.apiAuthSignUp.data.id],
          },
        },
        responses.adminSignInResponse.data.token,
      );
      //console.log("responses.check", responses.check);
      expect(responses.check.type).toBe("admin.databasecommand.get.success");
      expect(responses.check.data.users[0].login).toBe(rid + "@yopmail.com");
      expect(responses.check.data.users[0].password).toBe(rid);
      expect(responses.check.data.users[0].pseudo).toBe(rid);

      // Clean
      let adminDatabaseCommandInputs = {
        action: {
          type: "delete",
          collection: "users",
          ids: [responses.apiAuthSignUp.data.id],
        },
      };
      console.log("adminDatabaseCommandInputs", adminDatabaseCommandInputs);
      responses["adminDatabaseCommandResponse"] =
        await adminAPI.adminDatabaseCommand(
          adminDatabaseCommandInputs,
          responses.adminSignInResponse.data.token,
        );
      console.log(
        "responses.adminDatabaseCommandResponse",
        responses.adminDatabaseCommandResponse,
      );
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
      responses["testServices"] = await testServices([
        {
          type: "delete",
          collection: "users",
          ids: [responses.first_apiAuthSignUp.data.id],
        },
      ]);
      //console.log("responses.testServices", responses.testServices);
    });
    test.skip("unsuccessful: existing pseudo", async () => {
      expect(true).toBe(false);
    });
  });

  describe("Assessment POST apiAuthActivate", () => {
    test.skip("successful", async () => {
      expect(true).toBe(false);
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
    test.skip("successful", async () => {
      expect(true).toBe(false);
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

  describe("Assessment POST apiAuthAssess", () => {
    test.skip("successful", async () => {
      expect(true).toBe(false);
    });
    test.skip("unsuccessful: wrong token", async () => {
      expect(true).toBe(false);
    });
  });

  describe("Assessment POST apiAuthExistingPseudo", () => {
    test.skip("existing", async () => {
      expect(true).toBe(false);
    });
    test.skip("not existing", async () => {
      expect(true).toBe(false);
    });
  });
});
