require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

exports.apiTableCreate = async function (table, token) {
  try {
    const res = await axios.post(apiURL + "/table/v1/create", table, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

exports.apiTableGetDetails = async function (id, token) {
  try {
    const res = await axios.get(apiURL + "/table/v3/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

exports.apiTableGetHistory = async function (id, parameters, token) {
  try {
    const res = await axios.post(
      apiURL + "/table/v3/history/" + id,
      parameters,
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

exports.apiTableGetStats = async function (id, parameters, token) {
  try {
    const res = await axios.post(apiURL + "/table/v1/stats/" + id, parameters, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

exports.apiTableSave = async function apiTableSave(table, token) {
  try {
    const res = await axios.post(
      process.env.REACT_APP_SERVER_URL + "/table/v2/save",
      table,
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

exports.apiTableDelete = async function (id, token) {
  try {
    const res = await axios.delete(token + "/table/v1/" + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};