const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const userSchema = mongoose.Schema(
  {
    userid: { type: String, required: true, unique: true },
    // filled at creation via user/userInvite or auth/authSignUp
    // (re-use of MongoDB _id as a string for aggregations)
    pseudo: { type: String, required: true, unique: true },
    // filled at creation via user/userInvite or auth/authSignUp
    // edition via auth/authSignUp (if user status was "invited") and user/userChangePseudo
    login: { type: String, required: true, unique: true },
    // filled at creation via user/userInvite or auth/authSignUp
    // edition via userMerge /!\
    password: { type: String, required: true },
    // filled at creation via auth/authSignUp
    // left empty at creation via user/userInvite
    // edition via user/userChangePassword
    status: { type: String, required: true },
    // filled at creation via user/userInvite as "invited" and auth/authSignUp as "signedup"
    // edition via auth/authSignUp (if was "invited") to "signedup"
    // edition via auth/authActivate (if was "signedup") to "activated"
    activationtoken: { type: String },
    // filled at creation via auth/authSignUp as a random string
    passwordtoken: { type: String },
    // filled on auth/authResetPassword as a random string
    // emptied on user/userResetPassword
    priviledges: {
      type: [{ type: String }],
    },
    // "admin"
    alias: [
      {
        userid: { type: String },
        login: { type: String },
      },
    ],
    // append via user/userMerge
    meta: { type: Map },
    connection: {
      current: { type: Date },
      last: { type: Date },
    },
  },
  { strict: true },
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
