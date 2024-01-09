const axios = require("axios");
const env = require("../../env.json");

async function apiAuthSignIn(url, signInInputs) {
  try {
    const res = await axios({
      method: "post",
      url: url + "auth/v1/signin",
      data: signInInputs,
    });
    return res.data;
  } catch (err) {
    //console.error("apiAuthSignIn err", err);
    return err.response.data;
  }
}

module.exports = { apiAuthSignIn };
