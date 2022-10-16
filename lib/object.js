export default class GameObject {
  constructor({
    position = { x: 0, y: 0 },
    points = [],
    velocity = {},
    data = {},
    actions = [],
    style = {},
  } = {}) {
    Object.defineProperty(this, 'update', { writable: false })
    Object.defineProperty(this, 'setPosition', { writable: false })
    Object.defineProperty(this, 'setStyle', { writable: false })
    Object.defineProperty(this, 'addPoint', { writable: false })
    Object.defineProperty(this, 'addInputAction', { writable: false })

    this.position = { x: 0, y: 0 }
    this.setPosition(position.x, position.y, position.z)
  
    this.points = []
    points.forEach(point => this.addPoint(point.x, point.y))

    this.velocity = { x: 0, y: 0 }
    this.setVelocity(velocity.x, velocity.y, velocity.z)

    this.data = data

    this.actions = []
    actions.forEach(action => this.addInputAction(action))
    
    this.style = {}
    Object.keys(style).forEach(s => this.setStyle(s, style[s]))
  }
  
  update = (delta) => {
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta
  }

  setPosition = (x = 0, y = 0, z = 0) => {
    this.position = { x, y, z }
  }
  setVelocity = (x = 0, y = 0, z = 0) => {
    this.velocity = { x, y, z }
  }
  addPoint = (x = 0, y = 0, z = 0) => {
    this.points.push({ x, y, z })
  }
  setStyle = (prop, value) => {
    this.style[prop] = value
  }
  addInputAction = (on, action) => {
    if (typeof on === 'string' && typeof action === 'function')
      this.actions.push({ on, action })
  }
}