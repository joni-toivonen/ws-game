let ws
const canvas = document.createElement('canvas')
canvas.width = 640
canvas.height = 480
canvas.setAttribute('tabindex', '0')
const context = canvas.getContext('2d')
const characterSize = 32
const keyState = {}
let myId

const handleInput = e => {
  const previousState = {...keyState}
  keyState[e.code] = e.type === 'keydown'
  for (let key of Object.keys(keyState)) {
    if (keyState[key] !== previousState[key]) {
      ws.send(JSON.stringify(keyState))
      break
    }
  }
}

const gameArea = {
  start: () => {
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    ws = new WebSocket('ws://localhost:8080')
    ws.onmessage = handleMessage
    canvas.addEventListener('keydown', handleInput)
    canvas.addEventListener('keyup', handleInput)
  },
  clear: () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

const drawPlayers = coordinates => {
  for (let c of coordinates) {
    context.fillRect(c.x, c.y, characterSize, characterSize)
  }
}

const handleMessage = message => {
  try {
    const data = JSON.parse(message.data)
    if (data.hasOwnProperty('coordinates')) {
      gameArea.clear()
      drawPlayers(data.coordinates)
    } else if (data.hasOwnProperty('id')) {
      myId = data.id
      const idElement = document.createElement('p')
      idElement.textContent = `Your id: ${myId.toString()}`
      document.body.appendChild(idElement)
    }
  } catch (error) {
    console.log(error)
  }
}

const start = () => {
  gameArea.start()
}
