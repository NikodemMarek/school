import {Vectorial, Color, Collidable, Moveable, Rotatable} from './types'

class Point implements Vectorial {
    constructor(public x: number, public y: number) {}
}

class Tile extends Point implements Collidable, Moveable {
    constructor(x: number, y: number, public color: Color) {
        super(x, y)
    }

    isColliding = (points: Vectorial[]) =>
        points.some(({x, y}) => x === this.x && y === this.y)

    move = (vector: Vectorial) => {
        this.x += vector.x
        this.y += vector.y
    }
}

class Pill extends Point implements Collidable, Moveable, Rotatable {
    constructor(x: number, y: number, public tiles: Tile[]) {
        super(x, y)
    }

    absTiles = (): Tile[] =>
        this.tiles.map(
            ({x, y, color}) => new Tile(this.x + x, this.y + y, color)
        )

    move = ({x, y}: Vectorial) => {
        this.x += x
        this.y += y
    }

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

    isColliding = (points: Vectorial[]) =>
        this.absTiles().some((tile) => tile.isColliding(points))
}

export {Point, Tile, Pill}
