const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const tableSchema = mongoose.Schema({
  id: { type: String, required, unique: true},
  name: { type: String, required: false, unique: true },
  users: {
    type: [
      {
        type: String,
      },
    ],
  },
});

tableSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Table", tableSchema);
