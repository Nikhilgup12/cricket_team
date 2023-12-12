const express = require('express')
const app = express()
const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const dbpath = path.join(__dirname, 'cricketTeam.db')
app.use(express.json())
let db = null

const initilalize = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is start ')
    })
  } catch (e) {
    console.log(`error message: ${e.message}`)
    process.exit(1)
  }
}
initilalize()

// GET Cricket API

const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

app.get('/players/', async (request, response) => {
  const getPlayerQuery = `select * from cricket_team`
  const player = await db.all(getPlayerQuery)
  response.send(
    player.map(each => {
      convertDbObjectToResponseObject(each)
    }),
  )
})

// Add Player API

app.post('/players/', async (request, response) => {
  const playerdetails = request.body
  const {playerName, jerseyNumber, role} = playerdetails
  const addPlayerQuery = `insert into cricket_team (player_name,jersey_number,role) 
    values (
        '${playerName}',
        '${jerseyNumber}',
        '${role}'
     );`
  await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

// GET Book API

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `select * from cricket_team where player_id =${playerId}`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

// Update player API

app.put('/players/:playerId/', async (request, response) => {
  const playerdetails = request.body
  const {playerId} = request.params
  const {playerName, jerseyNumber, role} = playerdetails
  const addPlayerQuery = `update cricket_team 
     set player_name = '${playerName}',
         jersey_number = '${jerseyNumber}',
         role = '${role}'
         where player_id=${playerId}`
  await db.run(addPlayerQuery)
  response.send('Player Details Updated')
})

// Delete player API

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteBookQuery = `delete from book where player_id = ${playerId}`
  await db.run(deleteBookQuery)
  response.send('Player Removed')
})

module.exports = app
