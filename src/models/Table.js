const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const tableSchema = mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    guests: { type: Number, required: true },
    users: {
      type: [
        {
          type: String,
        },
      ],
    },
    meta: { type: Map, of: String },
  },
  { strict: true }
);

tableSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Table", tableSchema);
