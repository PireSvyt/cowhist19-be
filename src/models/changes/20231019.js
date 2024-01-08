const MongoClient = require("mongodb").MongoClient;
const envjson = require("../../../env.json");

async function script20231019() {
  try {
    let DB_URL =
      "mongodb+srv://savoyatp:" +
      envjson.DB_PW +
      "@" +
      envjson.DB_CLUSTER +
      "?retryWrites=true&w=majority";
    const client = new MongoClient(DB_URL, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    // Connection
    console.log("Openning server");
    await client.connect();
    console.log("Connected correctly to server");

    // Game
    const gameCollection = client.db("test").collection("games");
    gameCollection.find().forEach(function (game) {
      // Migration operations
      game.gameid = game.id;
      game.tableid = game.table;
      game.players = game.players.map((p) => {
        if (p.nonuser === undefined) {
          return { userid: p.id, role: p.role };
        } else {
          return { userid: p.id, role: p.role, nonuser: p.nonuser };
        }
      });
      // Version change
      game.__v = 2.0;
      // Save
      console.log("game", game);
      //gameCollection.save(game);
    });

    // Table
    const tableCollection = client.db("test").collection("tables");
    tableCollection.find().forEach(function (table) {
      // Migration operations
      table.tableid = table.id;
      table.userids = table.users;
      // Version change
      table.__v = 2.0;
      // Save
      console.log("table", table);
      //tableCollection.save(table);
    });

    // User
    const userCollection = client.db("test").collection("users");
    userCollection.find().forEach(function (user) {
      // Migration operations
      user.userid = user.id;
      // Version change
      user.__v = 2.0;
      // Save
      console.log("user", user);
      //userCollection.save(user);
    });
  } catch (err) {
    console.log(err.stack);
  }
}

script20231019();
