// Services
const serviceTableDelete = require("../../table/services/serviceTableDelete.js");
const serviceTableCreate = require("../../table/services/serviceTableCreate.js");
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
    let allWentWell = true;

    populateData.tables.forEach((table) => {
      console.log("servicePopulate table");
      console.log(table);

      serviceTableDelete(table.id).then(() => {
        serviceTableCreate(table);
      });
      /*
      // Delete previous table
      console.log("servicePopulate.delete");
      serviceTableDelete(table.id)
        .then((deleteOutcome) => {
          console.log("deleteOutcome");
          console.log(deleteOutcome);
          // Create new table
          console.log("servicePopulate.create");
          serviceTableCreate(table)
            .then((createOutcome) => {
              console.log("createOutcome");
              console.log(createOutcome);
            })
            .catch((err) => {
              console.log("servicePopulate create table error");
              console.log(err);
            });
        })
        .catch((err) => {
          console.log("servicePopulate delete table error");
          console.log(err);
        });
    */
    });

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
  });
};
