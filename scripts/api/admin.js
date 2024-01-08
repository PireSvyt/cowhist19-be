const axios = require("axios");
const env = require("../../env.json");

async function apiAdminDatabaseCommand(url, action, token) {
  try {
    const res = await axios({
      method: "post",
      url: url + "admin/v1/databasecommand",
      data: action,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    //console.error('apiAdminDatabaseCommand err', err)
    return err.response.data;
  }
}

module.exports = { apiAdminDatabaseCommand };
