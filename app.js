let express = require("express");
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");
let app = express();
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
app.use(express.json());
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
app.get("/players/", async (request, response) => {
  const getArray = `
  SELECT *
  FROM cricket_team;
  `;
  let playerArray = await db.all(getArray);
  let playerList = [];

  for (let item of playerArray) {
    let getAray = {};
    getAray.playerId = item.player_id;
    getAray.playerName = item.player_name;
    getAray.jerseyNumber = item.jersey_number;
    getAray.role = item.role;
    playerList.push(getAray);
  }
  response.send(playerList);
});

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  let getArray = `
  SELECT *
  FROM cricket_team
  where player_id=${playerId};
  `;
  let getAray = {};

  let playerArray = await db.get(getArray);
  getAray.playerId = playerArray.player_id;
  getAray.playerName = playerArray.player_name;
  getAray.jerseyNumber = playerArray.jersey_number;
  getAray.role = playerArray.role;

  response.send(getAray);
});

app.post("/players/", async (request, response) => {
  let playerDetails = request.body;
  let { player_name, jersey_number, role } = playerDetails;
  const getArray = `
  INSERT INTO cricket_team (playerName,jerseyNumber,role)
VALUES (${player_name},${jersey_number},${role});
  `;
  let playerArray = await db.run(getArray);
  response.send("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let playerDetails = request.body;
  let { player_name, jersey_number, role } = playerDetails;
  const getArray = `
  update cricket_team set playerName=${player_name},jerseyNumber=${jersey_number},role=${role}
  where playerId = ${playerId};
  `;
  let playerArray = await db.run(getArray);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  const getArray = `
  delete from cricket_team 
  where playerId = ${playerId};
  `;
  let playerArray = await db.run(getArray);
  response.send("Player Removed");
});
module.exports = app;
