const mongoose = require("mongoose");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const gameSchema = mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    table: { type: String, required: true },
    date: { type: Date, required: true },
    contract: { type: String, required: true },
    outcome: { type: Number, required: true },
    players: {
      type: [
        {
          _id: { type: String, required: true },
          role: { type: String, required: true },
        },
      ],
    },
    meta: { type: Map, of: String },
  },
  { strict: true }
);

module.exports = mongoose.model("Game", gameSchema);
