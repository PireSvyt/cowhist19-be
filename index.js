const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//await mongoose.connect("your_mongo_url", (err, db) => {
//console.log("MongoDB Connected....");
//});

// CONNECT MONGO
let DB_PW = "CunoSBF8sWbMs5Ux";
let DB_ROOT = "cowhist19-pariscluster.n4sn6uh.mongodb.net/";
let DB_ENV = process.env.NODE_ENV === "production" ? "prod" : "preprod";
let DB_URL = DB_ROOT & DB_ENV & "?retryWrites=true&w=majority";
mongoose
  .connect("mongodb+srv://savoyatp:" + DB_PW + "@" + DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => {
    console.log("Connexion à MongoDB échouée");
    console.log(err);
  });

// CAPTURE REQ BODY
app.use(express.json());

// CORS MANAGEMENT
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

//
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.listen(3000, () => console.log(`Server running on 3000`));

app.post("/login", async (req, res) => {
  try {
    const { userlogin, password } = req.body;
    const user = await User.findOne({ userlogin });
    if (!user) {
      return res.json({ msg: "Please enter a valid userlogin" });
    }
    const accessToken = jwt.sign({ userlogin, id: user._id }, JWT_SECRET, {
      expiresIn: process.env.NODE_ENV === "production" ? "6h" : "2 days",
    });
    res.json({ msg: "User logged in!", accessToken });
  } catch (err) {
    console.log(err);
    res.status(503).json({ msg: "Server error!" });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.status(401).json({ msg: "Not Authorized" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ msg: err });
    req.user = user;
    next();
  });
};

app.get("/dashboard", authenticateToken, (req, res) => {
  res.send("<h1>Welcome to dashboard</h1>");
});
