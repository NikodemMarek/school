import {IPoint, ITile, IPill, Color} from './types'

class Point implements IPoint {
    constructor(public x: number, public y: number) {}
}

class Tile implements ITile {
    constructor(public x: number, public y: number, public color: Color) {}
}

class Pill implements IPill {
    constructor(public x: number, public y: number, public tiles: ITile[]) {}

    move = ({x, y}: IPoint) => {
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
}

export {Point, Tile, Pill}
