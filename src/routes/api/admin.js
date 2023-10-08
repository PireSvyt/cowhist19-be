require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

exports.adminUserDelete = async function (uid) {
  try {
    const res = await axios.delete(apiURL + "/admin/v1/user/" + uid);
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
