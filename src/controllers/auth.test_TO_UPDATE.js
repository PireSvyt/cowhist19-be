require("@jest/globals");
const mongoose = require("mongoose");
const request = require("supertest");

var auth = require("./auth");

// Retrieve environement variables
require("dotenv").config();

/*

    TEST OF AUTH ENDPOINTS

*/

describe("TEST OF ENDPOINTS : auth ", () => {
  /* Connecting to the database before each test. */
  beforeEach(async () => {
    let DB_URL =
      "mongodb+srv://savoyatp:" +
      process.env.DB_PW +
      "@" +
      process.env.DB_CLUSTER +
      "?retryWrites=true&w=majority";
    await mongoose.connect(DB_URL);
  });

  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.connection.close();
  });

  // Length input check
  describe("Assessment of signup endpoint", () => {
    let req = {
      body: {
        pseudo: "ABC",
        login: "ABC",
        password: "ABC",
      },
    };
    describe("When accounts already exists", () => {
      test("should return 200", async () => {
        const response = await auth.signup(req);
        console.log("response");
        console.log(response);
        /* 
        Expected response
        {
            "status": 409,
            "message": "utilisateur déjà existant"
        }
        */
        expect(response.statusCode).toBe(409);
        expect(response.body.status).toBe(409);
        expect(response.body.message).toBe("utilisateur déjà existant");
      });
    });
  });
});
