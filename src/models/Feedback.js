const mongoose = require("mongoose");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const feedbackSchema = mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    userid: { type: String, required: true },
    consent: { type: Boolean, required: true },
    source: { type: String, required: true },
    feedback: { type: String, required: false },
    tag: { type: String, required: false },
    meta: { type: Map, required: false },
  },
  { strict: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
