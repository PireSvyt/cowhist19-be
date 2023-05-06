const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

mongoose.set("debug", true);

const userSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  pseudo: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
  activationtoken: { type: String },
  priviledges: {
    type: [
      {
        type: String,
      },
    ],
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
