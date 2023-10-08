require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

exports.apiUserChangePassword = async function (changePasswordInputs) {
  try {
    const res = await axios.post(
      process.env.REACT_APP_SERVER_URL + "/user/v1/changepassword",
      changePasswordInputs,
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
