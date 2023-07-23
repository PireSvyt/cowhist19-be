require("dotenv").config();
const express = require("express");
const app = express();

const serviceConnectMongoDB = require("./src/database/serviceConnectDatabase.js");
const authRoutes = require("./src/routes/auth.js");
const userRoutes = require("./src/routes/user.js");
const gameRoutes = require("./src/routes/game.js");
const tableRoutes = require("./src/routes/table.js");
const adminRoutes = require("./src/routes/admin.js");
const feedbackRoutes = require("./src/routes/feedback.js");
const notificationRoutes = require("./src/routes/notification.js");

// CONNECT MONGO
serviceConnectMongoDB();

// CAPTURE REQ BODY
app.use(express.json());

// CORS MANAGEMENT
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.SUPPORTED_ORIGIN);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Max-Age", "3600");
  next();
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/game", gameRoutes);
app.use("/table", tableRoutes);
app.use("/admin", adminRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/notification", notificationRoutes);

// Landing
app.get("/", (req, res) => {
  res.send("<h1>Cowhist19© back end</h1>");
});

module.exports = app;
