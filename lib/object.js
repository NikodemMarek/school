import Point from './point.js'

export default class GameObject {
  get val() {
    return {
      position: this.position,
      points: this.points,
      velocity: this.velocity,
      ext: this.ext,
      actions: this.actions,
    }
  }

  constructor({
    position = {},
    points = [],
    velocity = {},
    actions = [],
    ext = {},
  } = {}) {
    // Make methods immutable.
    Object.defineProperty(this, `update`, { writable: false })
    Object.defineProperty(this, `setPosition`, { writable: false })
    Object.defineProperty(this, `setVelocity`, { writable: false })
    Object.defineProperty(this, `addPoint`, { writable: false })
    Object.defineProperty(this, `addInputAction`, { writable: false })

    // Set class properties via setters, to ensure they are valid.
    this.setPosition(position)
  
    points.forEach(point =>
      this.addPoints(point))

    this.velocity = { x: 0, y: 0 }
    this.setVelocity(velocity.x, velocity.y, velocity.z)

    this.actions = []
    actions.forEach(action =>
      this.addInputAction(action))

    this.ext = ext
  }
  
  update = (delta) => {
    this.position.x += this.velocity.x * delta
    this.position.y += this.velocity.y * delta
  }

  setPosition = (point) => {
    this.position = new Point(point)
    return this
  }
  addPoints = (... points) => {
    this.points = this.points
      .concat(points
        .map(point => new Point(point)))
    return this
  }
  setVelocity = (velocity) => {
    this.velocity = new Point(velocity)
    return this
  }
  addInputAction = (on, action) => {
    if (typeof on === 'string' && typeof action === 'function')
      this.actions.push({ on, action })

    return this
  }
}