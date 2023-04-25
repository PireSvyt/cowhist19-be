const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  table: { type: String, required: true },
  date: { type: Date, required: true },
  contract: { type: String, required: true },
  outcome: { type: Number, required: true },
  attack: {
    type: [
      {
        id: { type: String },
      },
    ],
    required: true,
  },
  defense: {
    type: [
      {
        id: { type: String },
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("Game", gameSchema);
