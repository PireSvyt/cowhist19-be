// Services
const serviceTableDelete = require("../../table/services/serviceTableDelete.js");
//const serviceTableSave = require("../../table/services/serviceTableSave.js");
const gameSave = require("../../game/gameSave.js");

module.exports = async function servicePopulate(header) {
  /*
  
  populate the database with mocked data
  
  */

  console.log("admin.servicePopulate");

  const populateData = {
    tables: [
      {
        id: "mockedtable1",
        name: "YOLO",
        users: [
          {
            _id: "6457f5b9746d3231b7dab2cc",
          },
          {
            _id: "645f8bb50a53a91da62b31b0",
          },
          {
            _id: "645f8bcd0a53a91da62b31b7",
          },
          {
            _id: "645f8bdf0a53a91da62b31be",
          },
          {
            _id: "6462e8de6e1746f44a560ed1",
          },
        ],
      },
    ],
  };

  return new Promise((resolve, reject) => {
    try {
      let allWentWell = true;

      // Delete previous tables
      let res = {};
      populateData.tables.forEach((table) => {
        console.log("servicePopulate.delete table : ");
        console.log(table);
        serviceTableDelete(table.id).then((deleteOutcome) => {
          console.log("deleteOutcome");
          console.log(deleteOutcome);
        });
      });

      // Create new tables
      /*populateData.tables.forEach((table) => {
        console.log("servicePopulate.save table : ");
        console.log(table);
        tableSave(table).then((saveOutcome) => {
          console.log("saveOutcome");
          console.log(saveOutcome);
        });
      });*/

      // Create new games

      // Outcome
      if (allWentWell) {
        resolve({
          outcome: "success",
        });
      } else {
        resolve({
          outcome: "error",
          error: "all went not well",
        });
      }
    } catch (err) {
      if (process.env.REACT_APP_DEBUG === "TRUE") {
        console.log("service caught error");
        console.log(err);
      }
      resolve({
        outcome: "error",
        error: err,
      });
    }
  });
};
