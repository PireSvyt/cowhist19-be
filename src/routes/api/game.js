require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

exports.apiGameSave = async function (saveInputs, token) {
  try {
    const res = await axios.post(apiURL + "game/v1/save", saveInputs, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

exports.apiGameDelete = async function (deleteId, token) {
  try {
    const res = await axios.delete(apiURL + "game/v1/" + deleteId, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

exports.apiGameGet = async function (getId, token) {
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
};
