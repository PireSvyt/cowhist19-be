require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

exports.apiGameSave = async function (saveInputs, token) {
  try {
    const res = await axios.post(
      process.env.REACT_APP_SERVER_URL + "game/v1/save",
      saveInputs,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

exports.apiGameDelete = async function (deleteId, token) {
  try {
    const res = await axios.delete(
      process.env.REACT_APP_SERVER_URL + "game/v1/" + deleteId,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

exports.apiGameGet = async function (getId, token) {
  try {
    const res = await axios.get(
      process.env.REACT_APP_SERVER_URL + "game/v1/" + getId,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
