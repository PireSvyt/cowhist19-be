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
    status: { type: String, required: true },
    activationtoken: { type: String, unique: true },
    priviledges: {
      type: [
        {
          type: String,
        },
      ],
    },
  },
  { strict: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
