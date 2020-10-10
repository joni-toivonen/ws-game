const width = 640
const height = 480
const characterSize = 32
const speed = 5
const gravity = 2
const platforms = [{ x: 350, y: 150, width: 200, height: 25 },
                   { x: 64, y: 350, width: 200, height: 25 }]

const detectCollision = coordinate => {
  for (let p of platforms) {
    if (coordinate.x >= (p.x + p.width)
        || (coordinate.x + characterSize) <= p.x
        || coordinate.y >= (p.y + p.height)
        || (coordinate.y + characterSize) <= p.y) continue
    else return p
  }
  return false
}

const detectPokeCollision = (pokePosition, coordinates) => {
  for (let c of coordinates) {
    if (pokePosition.x >= (c.x + characterSize)
        || (pokePosition.x + pokePosition.width) <= c.x
        || pokePosition.y >= (c.y + characterSize)
        || (pokePosition.y + pokePosition.height) <= c.y) continue
    else return c
  }
  return false
}

const poke = (coordinate, coordinates) => {
  const pokePosition = { y: coordinate.y + characterSize / 3,
                         width: characterSize / 2,
                         height: characterSize / 4 }
  coordinate.facing === 'left'
    ? pokePosition.x = coordinate.x - characterSize / 2
    : pokePosition.x = coordinate.x + characterSize
  const hit = detectPokeCollision(pokePosition, coordinates.filter(e => e.id !== coordinate.id))
  if (hit) {
    coordinate.score++
    hit.x = 0
    hit.y = 0
  }
}

const handleGravity = coordinates => {
  for (let c of coordinates) {
    c.y += gravity
    const platform = detectCollision(c)
    if (platform) c.y = platform.y - (characterSize)
    if (c.y > height - characterSize) c.y = height - characterSize
  }
}

const handleInput = (coordinates, clientInput) => {
  for (let c of coordinates) {
    if (clientInput[c.id]['KeyA']) {
      c.x -= speed
      c.facing = 'left'
      const platform = detectCollision(c)
      if (platform) c.x = platform.x + platform.width
      if (c.x < 0) c.x = 0
    }
    if (clientInput[c.id]['KeyD']) {
      c.x += speed
      c.facing = 'right'
      const platform = detectCollision(c)
      if (platform) c.x = platform.x - (characterSize)
      if (c.x > width - characterSize) c.x = width - characterSize
    }
    if (clientInput[c.id]['KeyW']) {
      c.y -= speed
      const platform = detectCollision(c)
      if (platform) c.y = platform.y + platform.height
      if (c.y < 0) c.y = 0
    }
    if (clientInput[c.id]['Space']) {
      c.poking = true
      poke(c, coordinates)
    } else {
      c.poking = false
    }
  }
}

module.exports.handleGravity = handleGravity
module.exports.handleInput = handleInput
module.exports.platforms = platforms
