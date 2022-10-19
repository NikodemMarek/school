export default class Point {
  #dimensions = []
  get dimensions() {
    return this.#dimensions
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
          acc[0] = Number.isFinite(dimension?.x)? dimension.x: acc[0]
          acc[1] = Number.isFinite(dimension?.y)? dimension.y: acc[1]
          acc[2] = Number.isFinite(dimension?.z)? dimension.z: acc[2]
        } else {
          acc.push(dimension)
        }

        return acc
      }, [])
      .map(dimension => Number.isFinite(dimension)? dimension: undefined)

    return this
  }
}