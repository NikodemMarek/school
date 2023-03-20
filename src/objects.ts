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

class ObjectsManager {
    constructor(
        private size: IPoint,
        public tiles: Tile[],
        public pill: Pill
    ) {}

    private isPillColliding = () => {
        const isCollidingBorders = this.pill.tiles.some(({x, y}) => {
            const [px, py] = [this.pill.x + x, this.pill.y + y]
            return px < 0 || px >= this.size.x || py < 0 || py >= this.size.y
        })

        if (isCollidingBorders) return true

        const isCollidingTiles = this.pill.tiles.some(({x, y}) => {
            const [px, py] = [this.pill.x + x, this.pill.y + y]
            return this.tiles.some(({x: tx, y: ty}) => px === tx && py === ty)
        })

        return isCollidingTiles
    }

    moveAll = ({x, y}: IPoint) => {
        this.movePill({x, y})
    }

    movePill = ({x, y}: IPoint) => {
        this.pill.move({x, y})

        if (!this.isPillColliding()) return

        this.pill.move({x: -x, y: -y})
    }
    rotatePill = (by: number) => {
        this.pill.rotate(by)

        if (!this.isPillColliding()) return

        this.pill.rotate(-by)
    }
}

export default ObjectsManager
