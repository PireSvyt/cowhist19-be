const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/*if (process.env.MONGOOSE_DEBUG === true) {
  mongoose.set("debug", true);
}*/

const tableSchema = mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: false, unique: true },
    users: {
      type: [
        {
          type: String,
        },
      ],
    },
  },
  { strict: true }
);

tableSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Table", tableSchema);
