require("dotenv").config();
const express = require("express");
const app = express();

const serviceConnectMongoDB = require("./src/database/serviceConnectDatabase.js");
const authRoutes = require("./src/routes/auth.js");
const userRoutes = require("./src/routes/user.js");
const gameRoutes = require("./src/routes/game.js");
const tableRoutes = require("./src/routes/table.js");

// CONNECT MONGO
serviceConnectMongoDB();

// CAPTURE REQ BODY
app.use(express.json());

// CORS MANAGEMENT
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.SUPPORTED_ORIGIN);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/game", gameRoutes);
app.use("/table", tableRoutes);

// Landing
app.get("/", (req, res) => {
  res.send("<h1>Cowhist19-BE</h1>");
});

module.exports = app;
