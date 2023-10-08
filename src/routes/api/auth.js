require("dotenv").config();
const axios = require("axios");

let apiURL = process.env.TESTSUITE_SERVER_URL;

exports.apiAuthSignUp = async function (signUpInputs) {
  try {
    const res = await axios.post(apiURL + "/auth/v1/signup", signUpInputs);
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

// Not automated
exports.apiAuthSendActivation = async function (sendActivationInputs) {
  try {
    const res = await axios.post(
      apiURL + "/auth/v1/sendactivation",
      sendActivationInputs,
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

exports.apAuthiActivate = async function (activateInputs) {
  try {
    const res = await axios.post(apiURL + "/auth/v1/activate", activateInputs);
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

exports.apiAuthSignIn = async function (signInInputs) {
  try {
    const res = await axios.post(apiURL + "/auth/v1/signin", signInInputs);
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

exports.apiAuthAssess = async function (token) {
  try {
    const res = await axios.post(apiURL + "/auth/v1/assess", { token: token });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

// Not automated
exports.apiAuthSendPassword = async function (sendPasswordInputs) {
  try {
    const res = await axios.post(
      apiURL + "/auth/v1/sendpassword",
      sendPasswordInputs,
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

exports.apiAuthExistingPseudo = async function (existingPseudoInput) {
  try {
    const res = await axios.post(
      apiURL + "/auth/v1/existingpseudo",
      existingPseudoInput,
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};
