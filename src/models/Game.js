const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true},
  table: { type: String, required: true },
  date: { type: Date, required: true },
  contract: { type: String, required: true },
  outcome: { type: Number, required: true },
  users: {
    type: [
      {
        id: { type: String, required: true },
        role: { type: String, required: true },
      },
    ],
  },
});

module.exports = mongoose.model("Game", gameSchema);
