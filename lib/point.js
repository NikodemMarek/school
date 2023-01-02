export default class Point {
    #x = 0
    #y = 0
    #z = 0

    // Get and set the dimensions of the point as an array.
    get vals() {
        return [this.#x, this.#y, this.#z]
    }
    set vals(val) {
        if (!Array.isArray(val)) throw new Error(`Vals must be an array!`)

        try {
            this.x = val[0]
            this.y = val[1]
            this.z = val[2]
        } catch {}
    }
    // Get and set the dimensions of the point as a object.
    get dimensions() {
        return {
            x: this.#x,
            y: this.#y,
            z: this.#z,
        }
    }
    set dimensions(val) {
        if (typeof val !== 'object' || val === null)
            throw new Error(`Dimensions must be an object!`)
        if (Array.isArray(val))
            throw new Error(`Dimensions cannot be an array!`)

        this.vals = Object.values(val)
    }

    // Getters and setters for the dimensions.
    get x() {
        return this.#x
    }
    set x(val) {
        if (Number.isFinite(val)) this.#x = val
        else throw new Error(`Point x dimension must be a number!`)
    }
    get y() {
        return this.#y
    }
    set y(val) {
        if (Number.isFinite(val)) this.#y = val
        else throw new Error(`Point y dimension must be a number!`)
    }
    get z() {
        return this.#z
    }
    set z(val) {
        if (Number.isFinite(val)) this.#z = val
        else throw new Error(`Point z dimension must be a number!`)
    }

    constructor(...dimensions) {
        if (typeof dimensions[0] === 'object' && dimensions[0] !== null) {
            if (Array.isArray(dimensions[0])) this.vals = dimensions[0]
            else this.dimensions = dimensions[0]
        } else this.vals = dimensions
    }

    /**
     * Add points together.
     *
     * @param  {...Point} points - The points to add.
     * @returns {Point} - Resulting point.
     */
    static add = (...points) =>
        points.reduce((acc, point) => {
            acc.x += point.x
            acc.y += point.y
            acc.z += point.z

            return acc
        }, new Point())
    /**
     * Multiply points together.
     *
     * @param  {...Point} points - The points to multiply.
     * @returns {Point} - Resulting point.
     */
    static multiply = (...points) =>
        points.reduce((acc, point) => {
            acc.x *= point.x === 0 ? 1 : point.x
            acc.y *= point.y === 0 ? 1 : point.y
            acc.z *= point.z === 0 ? 1 : point.z

            return acc
        }, new Point(1, 1, 1))
    /**
     * Multiply a point by value.
     *
     * @param {number} scale - The scale to multiply the point by.
     * @param  {Point} point - The point to scale.
     * @returns {Point} - Resulting point.
     */
    static scale = (scale, point) =>
        new Point(point.x * scale, point.y * scale, point.z * scale)

    /**
     * Rotate a point around a origin.
     *
     * @param {Point} origin - The origin point to rotate around.
     * @param {number | Point} angles - The angle, or a point with the x and y angles to rotate the point by.
     * @param {Point} point - The point to rotate.
     * @returns {Point} - Resulting point.
     */
    static rotate = (origin, angles, point) => {
        const [x, y, z] = point.vals
        const [ox, oy, oz] = origin.vals

        const [dx, dy, dz] = [x - ox, y - oy, z - oz]

        if (z === 0 || typeof angles === 'number') {
            const rot = (Math.PI / 180) * angles
            const [cos, sin] = [Math.cos(rot), Math.sin(rot)]

            return new Point(dx * cos + dy * sin + ox, dy * cos - dx * sin + oy)
        } else {
            const [a, b, g] = [
                // (Math.PI / 180) * angles.vals[0],
                // (Math.PI / 180) * angles.vals[1],
                // (Math.PI / 180) * angles.vals[2],
                ...angles.vals,
            ]

            const [cosa, sina] = [Math.cos(a), Math.sin(a)]
            const [cosb, sinb] = [Math.cos(b), Math.sin(b)]
            const [cosg, sing] = [Math.cos(g), Math.sin(g)]

            return new Point(
                cosa * cosb * dx +
                    (cosa * sinb * sing - sina * cosg) * dy +
                    (cosa * sinb * cosg + sina * sing) * dz +
                    ox,
                sina * cosb * dx +
                    (sina * sinb * sing + cosa * cosg) * dy +
                    (sina * sinb * cosg - cosa * sing) * dz +
                    oy,
                -sinb * dx + cosb * sing * dy + cosb * cosg * dz + oz
            )
        }
    }
}

/**
 * Add points together.
 *
 * @param  {...Point} points - The points to add to the current point.
 * @returns {Point} - The current point.
 */
Point.prototype.add = function (...points) {
    this.dimensions = Point.add(this, ...points).dimensions
    return this
}
/**
 * Multiply the point by other points.
 *
 * @param  {...Point} points - The points to multiply the current point by.
 * @returns {Point} - The current point.
 */
Point.prototype.multiply = function (...points) {
    this.dimensions = Point.multiply(this, ...points).dimensions
    return this
}
/**
 * Multiply the point by value.
 *
 * @param {number} scale - The scale to multiply the point by.
 * @returns {Point} - The current point.
 */
Point.prototype.scale = function (scale) {
    this.dimensions = Point.scale(scale, this).dimensions
    return this
}
/**
 * Rotate the point around the origin.
 *
 * @param {Point} origin - The origin point to rotate around.
 * @param {number | Point} angles - The angle, or a point with the x and y angles to rotate the point by.
 * @returns {Point} - The current point.
 */
Point.prototype.rotate = function (origin, angles) {
    this.dimensions = Point.rotate(origin, angles, this).dimensions
    return this
}