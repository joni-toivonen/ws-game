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

const handleGravity = coordinates => {
  for (let c of coordinates) {
    c.y += gravity
    const platform = detectCollision(c)
    if (platform) c.y = platform.y - (characterSize)
    if (c.y > height - characterSize) c.y = height - characterSize
  }
}

const moveCharacters = (coordinates, clientInput) => {
  for (let c of coordinates) {
    if (clientInput[c.id]['KeyA']) {
      c.x -= speed
      const platform = detectCollision(c)
      if (platform) c.x = platform.x + platform.width
      if (c.x < 0) c.x = 0
    }
    if (clientInput[c.id]['KeyD']) {
      c.x += speed
      const platform = detectCollision(c)
      if (platform) c.x = platform.x - (characterSize)
      if (c.x > width - characterSize) c.x = width - characterSize
    }
    if (clientInput[c.id]['Space']) {
      c.y -= speed
      const platform = detectCollision(c)
      if (platform) c.y = platform.y + platform.height
      if (c.y < 0) c.y = 0
    }
  }
}

module.exports.handleGravity = handleGravity
module.exports.moveCharacters = moveCharacters
module.exports.platforms = platforms
