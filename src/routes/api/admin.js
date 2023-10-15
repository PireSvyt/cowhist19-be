require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

exports.adminDatabaseCommand = async function (action, token) {
  try {
    const res = await axios.post(apiURL + "admin/v1/databasecommand", action, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
