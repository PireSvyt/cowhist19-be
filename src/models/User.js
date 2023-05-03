const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  id: { type: String, required, unique: true},
  pseudo: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
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
