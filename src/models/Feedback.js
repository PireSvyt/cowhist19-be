const mongoose = require("mongoose");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const feedbackSchema = mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
    userid: { type: String, required: true },
    consent: { type: Boolean, required: true },
    source: { type: String, required: true },
    tag: { type: String, required: false },
    text: { type: String, required: false },
  },
  { strict: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
