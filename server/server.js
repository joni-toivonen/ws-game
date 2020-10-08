const WebSocket = require('ws')
const port = 8080
let pingCounter = 0
let idCounter = 0
let clients = []
let coordinates = []
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
  let id = idCounter++
  ws.send(JSON.stringify({ id: id }))
  clients.push({ id: id, ws: ws })
  coordinates.push({ id: id, x: 0, y: 0 })
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

wss.on('connection', ws => {
  addClient(ws)
  ws.on('message', message => {
    handleMessage(ws, message)
  })
})

const broadcastCoordinates = () => {
  clients.forEach(client => {
    client.ws.send(JSON.stringify({ coordinates: coordinates }))
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
    handleGravity()
    moveCharacters()
    broadcastCoordinates()
    pingCounter++
  }
}

setInterval(updateGame, 16)

console.log(`Started websocket server on port ${port}`)
