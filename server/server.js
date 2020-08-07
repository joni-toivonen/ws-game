const WebSocket = require('ws')
const port = 8080

const wss = new WebSocket.Server({
  port: port
})

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log('message: ', message)
    ws.send(message)
  })

  ws.send(`hello`)
})

console.log(`Started websocket server on port ${port}`)
