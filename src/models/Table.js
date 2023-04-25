const mongoose = require("mongoose");

const tableSchema = mongoose.Schema({
  name: { type: String, required: false },
  users: {
    type: [
      {
        id: { type: String },
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("Table", tableSchema);
