const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(
        `The Server Started Running at http://localhost:3000/players/`
      );
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

app.get("/players/", async (request, response) => {
  const playersQuery = `SELECT * FROM cricket_team`;
  const players = await db.all(playersQuery);

  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    };
  };
  let playersArray = [];
  for (let dbObject of players) {
    let result = convertDbObjectToResponseObject(dbObject);
    playersArray.push(result);
  }
  response.send(playersArray);
});

initializeDBAndServer();

module.exports = app;

//
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const playerQuery = `INSERT INTO 
                                cricket_team    
                            (player_name, jersey_number, role)
                            
                            VALUES(

                                ${playerName}, ${jerseyNumber}, ${role}

                                )`;

  const players = await db.run(playerQuery);
  const playerId = players.lastID;

  response.send("Player Added to Team");
});
