require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

// TESTED
exports.apiGameCreate = async function (saveInputs, token) {
  try {
    const res = await axios.post(apiURL + "game/v1/create", saveInputs, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

/*exports.apiGameGet = async function (getId, token) {
  try {
    const res = await axios.get(apiURL + "game/v1/" + getId, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};*/

// TESTED
exports.apiGameDelete = async function (deleteInputs, token) {
  try {
    const res = await axios.post(apiURL + "game/v1/delete", deleteInputs, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
