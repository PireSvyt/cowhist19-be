require("@jest/globals");
const authAPI = require("../auth.js");
const adminAPI = require("../admin.js");
const toolkit = require("../../../resources/toolkit.js");

describe("TEST OF ENDPOINTS : auth", () => {
  describe("Assessment POST apiAuthSignUp", () => {
    test("successful", async () => {
      let signUpInputs = {
        login: "login_" + toolkit.random_id(),
        pseudo: "pseudo_" + toolkit.random_id(),
        password: "password_" + toolkit.random_id(),
      };
      console.log("signUpInputs", signUpInputs);
      let response = await authAPI.apiAuthSignUp(signUpInputs);
      console.log("response", response);
      expect(response.type).toBe("auth.signup.success.signedup");
      // Clen
      let clean = await adminAPI.adminUserDelete(response.id);
    });
    test.skip("successful: already signedup", async () => {
      let signUpInputs = {
        login: "login_" & toolkit.random_id(),
        pseudo: "pseudo_" & toolkit.random_id(),
        password: "password_" & toolkit.random_id(),
      };
      let otherAttemptInputs = {
        login: signUpInputs.login,
        pseudo: "pseudo_" & toolkit.random_id(),
        password: "password_" & toolkit.random_id(),
      };
      let dummy = await authAPI.apiAuthSignUp(signUpInputs);
      let response = await authAPI.apiAuthSignUp(otherAttemptInputs);
      //console.log("response", response);
      expect(response.type).toBe("auth.signup.success.alreadysignedup");
      // Clen
      let clean = await adminAPI.adminUserDelete(dummy.id);
    });
    test.skip("unsuccessful: existing pseudo", async () => {
      let signUpInputs = {
        login: "login_" & toolkit.random_id(),
        pseudo: "pseudo_" & toolkit.random_id(),
        password: "password_" & toolkit.random_id(),
      };
      let existingPseudoInputs = {
        login: "login_" & toolkit.random_id(),
        pseudo: signUpInputs.pseudo,
        password: "password_" & toolkit.random_id(),
      };
      let dummy = await authAPI.apiAuthSignUp(signUpInputs);
      let response = await authAPI.apiAuthSignUp(existingPseudoInputs);
      //console.log("response", response);
      expect(response.type).toBe("auth.signup.error.existingpseudo");
      // Clen
      let clean = await adminAPI.adminUserDelete(dummy.id);
      if (response.status !== 403) {
        let cleanAgain = await adminAPI.adminUserDelete(response.id);
      }
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
