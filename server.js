const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.Server(app)
const websocket = socketio(server)

server.listen(process.env.PORT || 3001, () =>
  console.log(`Listening on port ${process.env.PORT || 3001}`)
)

let players = []
let games = []

websocket.on('connection', socket => {
  players = [...players, socket.id]
  socket.on('info', () => {
    socket.emit('info', { players })
  })
  socket.broadcast.emit('info', { players })
  socket.on('invitation', (data, callback) => {
    if (websocket.sockets.connected[data])
      websocket.sockets.connected[data].emit('invitation', socket.id, res => {
        if (res) {
          games = [
            ...games,
            {
              host: socket.id,
              turn: socket.id,
              players: [
                { id: socket.id, total: 0, round: 0, roll: [0, 0] },
                { id: data, total: 0, round: 0, roll: [0, 0] }
              ]
            }
          ]
          socket.join(socket.id)
          websocket.sockets.connected[data].join(socket.id)
          websocket.to(socket.id).emit('start-game')
        }
        callback(res)
      })
  })

  socket.on('ready', callback => {
    callback(
      games.find(game => game.players.some(player => player.id === socket.id))
    )
  })

  socket.on('turn-roll', () => {
    const dices = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ]
    let currentGame = games.find(game =>
      game.players.some(player => player.id === socket.id)
    )
    games = games.filter(game => game !== currentGame)
    const player = currentGame.players.find(player => player.id === socket.id)
    const opponent = currentGame.players.find(player => player.id !== socket.id)
    if (dices.some(dice => dice === 1)) {
      games = games.filter(game => game !== currentGame)
      currentGame = {
        ...currentGame,
        turn: opponent.id,
        players: [
          { ...opponent, roll: [0, 0] },
          { ...player, round: 0, roll: dices }
        ]
      }
      games = [...games, currentGame]
    } else {
      currentGame = {
        ...currentGame,
        players: [
          { ...opponent },
          {
            ...player,
            round: player.round + dices.reduce((prev, curr) => prev + curr, 0),
            roll: dices
          }
        ]
      }
      games = [...games, currentGame]
    }
    websocket.to(currentGame.host).emit('update', currentGame)
  })

  socket.on('turn-end', () => {
    let currentGame = games.find(game =>
      game.players.some(player => player.id === socket.id)
    )
    games = games.filter(game => game !== currentGame)
    if (currentGame.players.some(player => player.total + player.round >= 100))
      return websocket.to(currentGame.host).emit('win', currentGame)
    const player = currentGame.players.find(player => player.id === socket.id)
    const opponent = currentGame.players.find(player => player.id !== socket.id)
    currentGame = {
      ...currentGame,
      turn: opponent.id,
      players: [
        { ...opponent, roll: [0, 0] },
        { ...player, total: player.total + player.round, round: 0 }
      ]
    }
    games = [...games, currentGame]
    websocket.to(currentGame.host).emit('update', currentGame)
  })

  socket.on('disconnect', () => {
    let currentGame = games.find(game =>
      game.players.some(player => player.id === socket.id)
    )
    if (currentGame) {
      const opponent = currentGame.players.find(
        player => player.id !== socket.id
      )
      games = games.filter(game => game !== currentGame)
      websocket
        .to(opponent.id)
        .emit('win', { ...currentGame, turn: opponent.id })
    }
    players = players.filter(player => player != socket.id)
    socket.broadcast.emit('info', { players })
  })
})
