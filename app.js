const express = require('express')
const api = express()

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')
const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

api.listen(3000)

//creating database console
let createDbConsole = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
  } catch (e) {
    console.log(`Database Error: ${e}`)
    process.exit(1)
  }
}

createDbConsole()

api.use(express.json())

//function to convert into camalcase
let createCamalCase = obj => {
  return {
    playerId: obj.player_id,
    playerName: obj.player_name,
    jerseyNumbr: obj.jersey_number,
    role: obj.role,
  }
}

//get all players
api.get('/players/', async (request, response) => {
  const query = `
    select * from cricket_team
    `

  const getPlayers = await db.all(query)
  response.send(getPlayers.map(each => createCamalCase(each)))
})

//post players
api.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails

  const query = `
    Insert into cricket_team(player_name, jersey_number, role)
    values("${playerName}", ${jerseyNumber}, "${role}");
    `

  const postPlayer = await db.run(query)
  response.send('Player Added to Team')
})

//get one player
api.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params

  const query = `
    select * from cricket_team
    where player_id = ${playerId};
    `

  const getOnePlayer = await db.get(query)
  response.send(getOnePlayer)
})

//put player
api.put('/players/:playerId', async (request, response) => {
  const playerDetails = request.body
  const {playerId} = request.params

  const {playerName, jerseyNumber, role} = playerDetails

  const query = `
    update cricket_team
    set 
    player_name = "${playerName}",
    jersey_number = ${jerseyNumber},
    role = "${role}"
    where 
    player_id = ${playerId};
    `

  const putPlayer = await db.run(query)
  response.send('Player Details Updated')
})

//delete players
api.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params

  const query = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId};
    `

  const deletePlayer = await db.run(query)
  response.send('Player Removed')
})


module.exports = api
