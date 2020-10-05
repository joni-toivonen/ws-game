const WebSocket = require('ws')
const port = 8080
const clients = []
const coordinates = []
const clientInput = {}
const width = 640
const height = 480
const characterSize = 32
const speed = 5
const gravity = 2

const wss = new WebSocket.Server({
  port: port
})

const addClient = ws => {
  ws.send(JSON.stringify({ id: clients.length }))
  clients.push(ws)
  coordinates.push({ id: clients.length - 1, x: 0, y: 0 })
}

const handleMessage = (ws, message) => {
  try {
    const parsedMessage = JSON.parse(message)
    clients.forEach((client, i) => {
      if (client === ws) {
        clientInput[i] = parsedMessage
      }
    })
  } catch (e) {
    console.log(e)
  }
}

wss.on('connection', ws => {
  addClient(ws)
  ws.on('message', message => {
    handleMessage(ws, message)
  })
})

const broadcastCoordinates = () => {
  clients.forEach(client => {
    client.send(JSON.stringify({ coordinates: coordinates }))
  })
}

const handleGravity = () => {
  for (let c of coordinates) {
    c.y += gravity
    if (c.y > height - characterSize) c.y = height - characterSize
  }
}

const moveCharacters = () => {
  for (let c of coordinates) {
    if (clientInput[c.id] && clientInput[c.id]['KeyA']) {
      c.x -= speed
      if (c.x < 0) c.x = 0
    }
    if (clientInput[c.id] && clientInput[c.id]['KeyD']) {
      c.x += speed
      if (c.x > width - characterSize) c.x = width - characterSize
    }
    if (clientInput[c.id] && clientInput[c.id]['Space']) {
      c.y -= speed
      if (c.y < 0) c.y = 0
    }
  }
}

const updateGame = () => {
  if (clients.length > 0) {
    handleGravity()
    moveCharacters()
    broadcastCoordinates()
  }
}

setInterval(updateGame, 16)

console.log(`Started websocket server on port ${port}`)
