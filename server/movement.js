const width = 640
const height = 480
const characterSize = 32
const speed = 5
const gravity = 2

const handleGravity = coordinates => {
  for (let c of coordinates) {
    c.y += gravity
    if (c.y > height - characterSize) c.y = height - characterSize
  }
}

const moveCharacters = (coordinates, clientInput) => {
  for (let c of coordinates) {
    if (clientInput[c.id]['KeyA']) {
      c.x -= speed
      if (c.x < 0) c.x = 0
    }
    if (clientInput[c.id]['KeyD']) {
      c.x += speed
      if (c.x > width - characterSize) c.x = width - characterSize
    }
    if (clientInput[c.id]['Space']) {
      c.y -= speed
      if (c.y < 0) c.y = 0
    }
  }
}

module.exports.handleGravity = handleGravity
module.exports.moveCharacters = moveCharacters
