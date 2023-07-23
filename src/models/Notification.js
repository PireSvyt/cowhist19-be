const mongoose = require("mongoose");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const notificationSchema = mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    title: { type: String, required: true },
    explanation: { type: String },
  },
  { strict: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
