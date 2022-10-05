export default class GameObject {
  constructor({
    position = { x: 0, y: 0 },
    points = [],
    velocity = {},
    data = {},
    style = {},
  } = {}) {
    Object.defineProperty(this, 'setPosition', { writable: false })
    Object.defineProperty(this, 'setValue', { writable: false })
    Object.defineProperty(this, 'addPoint', { writable: false })

    this.position = position
    this.points = points

    this.velocity = velocity
    this.data = data

    this.style = style
  }
}

GameObject.prototype.setPosition = function(x = 0, y = 0, z = 0) {
  this.position = { x, y, z }
}
GameObject.prototype.setStyle = function(prop, value) {
  this.style[prop] = value
}
GameObject.prototype.addPoint = function(x = 0, y = 0, z = 0) {
  this.points.push({ x, y, z })
}