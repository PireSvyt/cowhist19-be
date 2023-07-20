const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const userSchema = mongoose.Schema(
  {
    id: { type: String, unique: true },
    pseudo: { type: String, required: true, unique: true },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, required: true }, // invited, signedup, activated
    activationtoken: { type: String, unique: false },
    passwordresettoken: { type: String, unique: false },
    priviledges: {
      type: [{ type: String }],
    },
    alias: [
      {
        id: { type: String },
        login: { type: String },
      },
    ],
    meta: { type: Map },
    connection: {
      current: { type: Date, required: false },
      last: { type: Date, required: false },
    },
  },
  { strict: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
