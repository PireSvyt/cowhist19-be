const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const settingSchema = mongoose.Schema(
  {
    schema: { type: String},
    key: { type: String, required: true, unique: true },
    description: { type: String, required: true, unique: true },
    value: {  },
  },
  { strict: true },
);

settingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("setting", settingSchema);
