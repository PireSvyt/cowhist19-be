const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  table: { type: String, required: true },
  date: { type: Date, required: true },
  contract: { type: String, required: true },
  outcome: { type: Number, required: true },
  attack: {
    type: [
      {
        type: String,
      },
    ],
  },
  defense: {
    type: [
      {
        type: String,
      },
    ],
  },
});

module.exports = mongoose.model("Game", gameSchema);
