let ws
const canvas = document.createElement('canvas')
canvas.width = 640
canvas.height = 480
canvas.setAttribute('tabindex', '0')
const context = canvas.getContext('2d')

const gameArea = {
  start: () => {
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    ws = new WebSocket('ws://localhost:8080')
    ws.onmessage = handleMessage
    canvas.addEventListener('keypress', handleInput)
  },
  clear: () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

const handleMessage = message => {
  console.log(message)
  context.fillText(`Received: ${message.data}`, 100, 115)
}

const handleInput = (e) => {
  console.log(e)
  switch (e.charCode) {
  case 32:
    gameArea.clear()
    context.fillText('Sending message:', 100, 100)
    ws.send('space')
    break;
  case 97:
    ws.send('left')
    gameArea.clear()
    context.fillText('Sending message:', 100, 100)
    break;
  case 100:
    ws.send('right')
    gameArea.clear()
    context.fillText('Sending message:', 100, 100)
    break;
  case 115:
    ws.send('down')
    gameArea.clear()
    context.fillText('Sending message:', 100, 100)
    break;
  case 119:
    ws.send('up')
    gameArea.clear()
    context.fillText('Sending message:', 100, 100)
    break;
  }
}

const start = () => {
  gameArea.start()
}
