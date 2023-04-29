const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
  tables: {
    type: [
      {
        type: String,
      },
    ],
  },
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
