require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

exports.apiUserChangePassword = async function (changePasswordInputs, token) {
  try {
    const res = await axios.post(
      apiURL + "user/v1/changepassword",
      changePasswordInputs,
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

exports.apiUserInvite = async function (inviteInputs, token) {
  try {
    const res = await axios.post(apiURL + "/user/v1/invite", inviteInputs, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};


const userIsActivated = require("../controllers/user/userIsActivated.js");
const userDetails = require("../controllers/user/userDetails.js");
const userStats = require("../controllers/user/userStats.js");