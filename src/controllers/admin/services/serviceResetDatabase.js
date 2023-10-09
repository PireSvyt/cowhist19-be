require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
var {
  adjustProbabilities,
  pickOne,
  getLastDates,
} = require("../../../resources/toolkit.js");
const contracts = require("../../../resources/contracts.json");

module.exports = async function serviceResetDatabase(reqInputs) {
  /*
  
  reset the database
  except the admin user
  
  */

  if (process.env.DEBUG) {
    console.log("admin.serviceresetdatabase");
  }

  return new Promise((resolve, reject) => {
    let allWentWell = true;

    // DB connection
    console.log("Openning server");
    let DB_URL =
      "mongodb+srv://savoyatp:" +
      process.env.DB_PW +
      "@" +
      process.env.DB_CLUSTER +
      "?retryWrites=true&w=majority";
    let mongoClient = new MongoClient(DB_URL, { useNewUrlParser: true });
    mongoClient
      .connect()
      .then((err) => {
        console.log("Connected correctly to server");

        // Data reset
        const feedbackCollection = mongoClient
          .db("test")
          .collection("feedbacks");
        feedbackCollection.drop();
        const gameCollection = mongoClient.db("test").collection("games");
        gameCollection.drop();
        const notificationCollection = mongoClient
          .db("test")
          .collection("notifications");
        notificationCollection.drop();
        const tableCollection = mongoClient.db("test").collection("tables");
        tableCollection.drop();
        const userCollection = mongoClient.db("test").collection("users");
        userCollection.drop();
        console.log("Collections dropped");

        // Insert admin
        console.log("Inserting admin");
        userCollection.insertOne({
          pseudo: "ADMIN",
          login: process.env.ADMIN_LOGIN,
          password: process.env.ADMIN_PASSWORD,
          status: "activated",
          activationtoken: "",
          priviledges: ["admin"],
        });

        // Outcome
        if (allWentWell) {
          resolve({
            type: "admin.serviceresetdatabase.success",
          });
        } else {
          resolve({
            type: "admin.serviceresetdatabase.error",
            error: "all went not well",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        resolve({
          type: "admin.serviceresetdatabase.error",
          error: err,
        });
      });
  });
};
