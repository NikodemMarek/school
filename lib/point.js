export default class Point {
  #dimensions = []
  // Get the dimensions of the point as an array.
  get val() {
    return this.#dimensions
  }
  // Get the dimensions of the point as a object.
  get dimensions() {
    return {
      x: this.#dimensions[0],
      y: this.#dimensions[1],
      z: this.#dimensions[2],
      ... this.#dimensions,
    }
  }
  // Protect #dimensions array from invalid data.
  set dimensions(val) {
    this.set(val)
  }
  
  // Shortcuts for x, y, and z dimensions.
  // Protect #dimensions array from invalid data.
  get x() {
    return this.dimensions[0]
  }
  set x(val) {
    this.set({ x: val })
  }
  get y() {
    return this.dimensions[1]
  }
  set y(val) {
    this.set({ y: val })
  }
  get z() {
    return this.dimensions[2]
  }
  set z(val) {
    this.set({ z: val })
  }

  constructor(... dimensions) {
    Object.defineProperty(this, `set`, { writable: false })
    this.set(... dimensions)
  }

  /**
   * Map any data to the point.
   * 
   * @param  {...any} dimensions - The dimensions of the point.
   */
  set = (... dimensions) => {
    this.#dimensions = dimensions
      .flat(Infinity)
      .reduce((acc, dimension) => {
        if (typeof dimension === `object`) {
          if (Number.isFinite(dimension?.x)) acc[0] = dimension.x
          if (Number.isFinite(dimension?.y)) acc[1] = dimension.y
          if (Number.isFinite(dimension?.z)) acc[2] = dimension.z
        } else
          acc.push(dimension)

        return acc
      }, [])
      .map(dimension => Number.isFinite(dimension)? dimension: undefined)

    return this
  }
}

/**
 * Add points together.
 * 
 * @param  {...any} points - The points to add to the current point.
 * @returns {Point} - The current point.
 */
Point.prototype.add = function (... points) {
  this.dimensions = points.reduce((acc, point) =>
    acc.map((dimension, i) =>
      dimension + (point?.val[i] || 0)),
    this.val)
  return this
}
/**
 * Multiply the point by other points.
 * 
 * @param  {...any} points - The points to multiply the current point by.
 * @returns {Point} - The current point.
 */
Point.prototype.multiply = function (... points) {
  this.dimensions = points.reduce((acc, point) =>
    acc.map((dimension, i) =>
      dimension * (point?.val[i] || 1)),
    this.val)
  return this
}
/**
 * Multiply the point by value.
 * 
 * @param {number} scale - The scale to multiply the point by.
 * @returns {Point} - The current point.
 */
Point.prototype.scale = function (scale) {
  this.dimensions = this.val.map(dimension =>
    dimension * scale)
  return this
}
/**
 * Rotate the point around the origin.
 * 
 * @param {Point} origin - The origin point to rotate around.
 * @param {number | Point} angle - The angle, or a point with the x and y angles to rotate the point by.
 * @returns {Point} - The current point.
 */
Point.prototype.rotate = function (origin, angles) {
  const [x, y, z] = this.val
  const [ox, oy, oz] = origin.val

  const [dx, dy, dz] = [x - ox, y - oy, z - oz]

  if (z && oz) {
    const [a, b, g] = [
      // (Math.PI / 180) * angles.val[0],
      // (Math.PI / 180) * angles.val[1],
      // (Math.PI / 180) * angles.val[2],
      ... angles.val
    ]

    const [cosa, sina] = [Math.cos(a), Math.sin(a)]
    const [cosb, sinb] = [Math.cos(b), Math.sin(b)]
    const [cosg, sing] = [Math.cos(g), Math.sin(g)]

    this.set({
      x: cosa * cosb * dx + (cosa * sinb * sing - sina * cosg) * dy + (cosa * sinb * cosg + sina * sing) * dz + ox,
      y: sina * cosb * dx + (sina * sinb * sing + cosa * cosg) * dy + (sina * sinb * cosg - cosa * sing) * dz + oy,
      z: -sinb * dx + cosb * sing * dy + cosb * cosg * dz + oz,
    })
  } else {
    const rot = (Math.PI / 180) * angles
    const [cos, sin] = [Math.cos(rot), Math.sin(rot)]

    this.set({
      x: dx * cos + dy * sin + ox,
      y: dy * cos - dx * sin + oy,
    })
  }

  return this
}