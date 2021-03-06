let ws
const canvas = document.createElement('canvas')
canvas.width = 640
canvas.height = 480
canvas.setAttribute('tabindex', '0')
const context = canvas.getContext('2d')
const characterSize = 32
const keyState = {}
let platforms = []
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

const drawMap = () => {
  for (let p of platforms) {
    context.fillRect(p.x, p.y, p.width, p.height)
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
    drawMap()
  }
}

const getPokePosition = coordinate => {
  const pokePosition = { y: coordinate.y + characterSize / 3,
                         width: characterSize / 2,
                         height: characterSize / 4 }
  coordinate.facing === 'left'
    ? pokePosition.x = coordinate.x - characterSize / 2
    : pokePosition.x = coordinate.x + characterSize
  return pokePosition
}

const drawPlayers = coordinates => {
  context.fillText('Scores:', 570, 10)
  coordinates.forEach((c, i) => {
    context.fillRect(c.x, c.y, characterSize, characterSize)
    if (c.poking) {
      const pokePosition = getPokePosition(c)
      context.fillRect(pokePosition.x, pokePosition.y, pokePosition.width, pokePosition.height)
    }
    context.fillText(`Player${c.id}: ${c.score}`, 570, 10 + 15*(i + 1))
  })
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
    } else if (data.hasOwnProperty('ping')) {
      ws.send(JSON.stringify({ pong: true }))
    } else if (data.hasOwnProperty('platforms')) {
      platforms = data.platforms
    }
  } catch (error) {
    console.log(error)
  }
}

const start = () => {
  gameArea.start()
}
