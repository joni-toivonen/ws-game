const WebSocket = require('ws')
const movement = require('./movement')
let pingCounter = 0
let idCounter = 0
let clients = []
let coordinates = []
const clientInput = {}

const addClient = ws => {
  let id = idCounter++
  ws.send(JSON.stringify({ id: id }))
  clients.push({ id: id, ws: ws })
  coordinates.push({ id: id, x: 0, y: 0 })
  clientInput[id] = {}
}

const handleMessage = (ws, message) => {
  try {
    const parsedMessage = JSON.parse(message)
    clients.forEach(client => {
      if (client.ws === ws) {
        if (parsedMessage.pong) {
          client.pong = true
        } else {
          clientInput[client.id] = parsedMessage
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const broadcastCoordinates = () => {
  clients.forEach(client => {
    client.ws.send(JSON.stringify({ coordinates: coordinates }))
  })
}

const ping = () => {
  const deadClients = []
  clients.forEach(client => {
    client.ws.send(JSON.stringify({ ping: true }))
    if (client.pong === false) {
      deadClients.push(client.id)
      delete clientInput[client.id]
    } else {
      client.pong = false
    }
  })
  clients = clients.filter(e => !deadClients.includes(e.id))
  coordinates = coordinates.filter(e => !deadClients.includes(e.id))
}

const updateGame = () => {
  if (clients.length > 0) {
    if (pingCounter >= 50) {
      ping()
      pingCounter = 0
    }
    movement.handleGravity(coordinates)
    movement.moveCharacters(coordinates, clientInput)
    broadcastCoordinates()
    pingCounter++
  }
}

const start = () => {
  const port = 8080
  const wss = new WebSocket.Server({
    port: port
  })

  wss.on('connection', ws => {
    addClient(ws)
    ws.on('message', message => {
      handleMessage(ws, message)
    })
  })

  console.log(`Started websocket server on port ${port}`)
  setInterval(updateGame, 16)
}

start()
