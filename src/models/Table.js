const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

mongoose.set('debug', true);

const tableSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true},
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
