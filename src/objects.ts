import {Vectorial, Color, Collidable, Moveable, Rotatable} from './types'

/**
 * A point in 2D space.
 */
class Point implements Vectorial {
    /**
     * Creates a point.
     *
     * @param x - X coordinate
     * @param y - Y coordinate
     */
    constructor(public x: number, public y: number) {}
}

/**
 * A singular tile element.
 */
class Tile extends Point implements Collidable, Moveable {
    /**
     * Creates a tile by calling Point constructor.
     *
     * @param x - X coordinate
     * @param y - Y coordinate
     * @param color - Color of the tile
     */
    constructor(x: number, y: number, public color: Color) {
        super(x, y)
    }

    /**
     * Moves the tile by the given vector.
     *
     * @param vector - Vector to move the tile by
     */
    move = (vector: Vectorial) => {
        this.x += vector.x
        this.y += vector.y
    }

    /**
     * Checks if the tile is colliding with any of the given points.
     *
     * @param points - Points to check collision with
     * @returns True if the tile is colliding with any of the given points
     */
    isColliding = (points: Vectorial[]) =>
        points.some(({x, y}) => x === this.x && y === this.y)
}

/**
 * A pill object.
 */
class Pill extends Point implements Collidable, Moveable, Rotatable {
    /**
     * Creates a pill by calling Point constructor.
     *
     * @param x - X coordinate
     * @param y - Y coordinate
     * @param tiles - Tiles that make up the pill
     */
    constructor(x: number, y: number, public tiles: Tile[]) {
        super(x, y)
    }

    /**
     * Returns tiles that make up the pill, but with absolute coordinates.
     *
     * @returns Tiles that make up the pill, but with absolute coordinates
     */
    absTiles = (): Tile[] =>
        this.tiles.map(
            ({x, y, color}) => new Tile(this.x + x, this.y + y, color)
        )

    /**
     * Moves the pill by the given vector.
     *
     * @param vector - Vector to move the pill by
     */
    move = (vector: Vectorial) => {
        this.x += vector.x
        this.y += vector.y
    }

    /**
     * Rotates the pill by the given number of 90 degree rotations.
     *
     * @param rawBy - Number of 90 degree rotations to perform
     */
    rotate = (rawBy: number) => {
        let by = rawBy % 4
        by = by < 0 ? by + 4 : by

        if (by === 0) return

        const matrix = [
            [
                [0, -1],
                [1, 0],
            ],
            [
                [-1, 0],
                [0, -1],
            ],
            [
                [0, 1],
                [-1, 0],
            ],
        ][by - 1]

        this.tiles.forEach((tile) => {
            const {x, y} = tile

            tile.x = x * matrix[0][0] + y * matrix[0][1]
            tile.y = x * matrix[1][0] + y * matrix[1][1]
        })
    }

    /**
     * Checks if the pill is colliding with any of the given points.
     *
     * @param points - Points to check collision with
     * @returns True if the pill is colliding with any of the given points
     */
    isColliding = (points: Vectorial[]) =>
        this.absTiles().some((tile) => tile.isColliding(points))
}

/**
 * A virus object.
 */
class Virus extends Point implements Collidable {
    /**
     * Creates a virus by calling Point constructor.
     *
     * @param x - X coordinate
     * @param y - Y coordinate
     * @param color - Color of the virus
     */
    constructor(x: number, y: number, public color: Color) {
        super(x, y)
    }

    /**
     * Checks if the virus is colliding with any of the given points.
     *
     * @param points - Points to check collision with
     * @returns - True if the virus is colliding with any of the given points
     */
    isColliding = (points: Vectorial[]) =>
        points.some(({x, y}) => x === this.x && y === this.y)
}

export {Point, Tile, Pill, Virus}
