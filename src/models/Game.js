const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  date: { type: Date, required: false },
  contract: { type: String, required: true },
  outcome: { type: Number, required: true},
  attack: { type: [ {
        id: { type: String }
      } ], required: true },
  defense: { type: [ {
        id: { type: String }
      } ], required: true }
});

module.exports = mongoose.model("Game", gameSchema);
