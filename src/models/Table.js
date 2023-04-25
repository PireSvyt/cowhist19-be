const mongoose = require("mongoose");

const tableSchema = mongoose.Schema({
  name: { type: String, required: false },
  users: {
    type: [
      {
        type: String,
      },
    ],
  },
});

module.exports = mongoose.model("Table", tableSchema);
