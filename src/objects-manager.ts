import {Color, Direction, Vectorial} from './types'
import {Pill, Tile, Virus} from './objects'

class ObjectsManager {
    public activePill: Pill = new Pill(0, 0, [])

    constructor(
        private size: Vectorial,
        public tiles: Tile[],
        public pills: Pill[],
        public viruses: Virus[]
    ) {
        this.newPill()
    }

    private newPill = () => {
        const colors = Object.values(Color)
        const tiles = [
            new Tile(0, 0, colors[Math.floor(Math.random() * colors.length)]),
            new Tile(1, 0, colors[Math.floor(Math.random() * colors.length)]),
        ]

        this.activePill = new Pill(Math.floor(this.size.x / 2), 0, tiles)

        this.activePill.rotate(Math.floor(Math.random() * 4))
    }

    private getOtherPills = (pill: Pill) => this.pills.filter((p) => p !== pill)
    private getOtherTiles = (tile: Tile) => this.tiles.filter((t) => t !== tile)

    private isPillCollidingBorders = (pill: Pill) =>
        pill.tiles.some(({x, y}) => {
            const [px, py] = [pill.x + x, pill.y + y]
            return this.isTileCollidingBorders({x: px, y: py} as Tile)
        })
    private isTileCollidingBorders = ({x, y}: Tile) =>
        x < 0 || x >= this.size.x || y < 0 || y >= this.size.y

    private getAligned = ({x: sx, y: sy, color: scolor}: Tile) => {
        const tiles = [
            ...this.pills.map((pill) => pill.absTiles()).flat(),
            ...this.tiles,
            ...(this.viruses as Tile[]),
        ]

        const [bottom, top, right, left]: Tile[][] = [[], [], [], []]

        for (let i = 1; i < tiles.length; i++) {
            const tile = tiles.find(
                ({x, y, color}) => x === sx + i && y === sy && scolor === color
            )

            if (!tile) break

            bottom.push(tile)
        }

        for (let i = 1; i < tiles.length; i++) {
            const tile = tiles.find(
                ({x, y, color}) => x === sx - i && y === sy && scolor === color
            )

            if (!tile) break

            top.push(tile)
        }

        for (let i = 1; i < tiles.length; i++) {
            const tile = tiles.find(
                ({x, y, color}) => x === sx && y === sy + i && scolor === color
            )

            if (!tile) break

            left.push(tile)
        }

        for (let i = 1; i < tiles.length; i++) {
            const tile = tiles.find(
                ({x, y, color}) => x === sx && y === sy - i && scolor === color
            )

            if (!tile) break

            right.push(tile)
        }

        return [bottom, top, right, left]
    }

    private popTiles = (tiles: Tile[]) => {
        const pillsToPop = this.pills.filter((pill) => pill.isColliding(tiles))
        this.pills = this.pills.filter((pill) => !pillsToPop.includes(pill))
        this.tiles.push(...pillsToPop.map((pill) => pill.absTiles()).flat())
        
        const virusesToPop = this.viruses.filter((virus) =>
            virus.isColliding(tiles)
        )
        this.viruses = this.viruses.filter(
            (virus) => !virusesToPop.includes(virus)
        )
        this.tiles.push(...(virusesToPop as Tile[]))

        this.tiles = this.tiles.filter(
            (tile) => !tiles.some(({x, y}) => x === tile.x && y === tile.y)
        )
    }

    update = (vector: Vectorial) => {
        this.tiles
            .sort((a, b) => a.y - b.y)
            .forEach((tile) => this.updateTile(vector, tile))
        this.pills
            .sort((a, b) => a.y - b.y)
            .forEach((pill) => this.updatePill(vector, pill))

        this.updateActivePill(vector)
    }

    public moveActivePill = (vector: Vectorial) => this.updateActivePill(vector)
    public rotateActivePill = (by: number) => {
        this.activePill.rotate(by)

        if (
            this.isPillCollidingBorders(this.activePill) ||
            this.activePill.isColliding([
                ...this.getOtherPills(this.activePill),
                ...this.tiles,
            ])
        )
            this.activePill.rotate(-by)
    }

    private updateActivePill = (vector: Vectorial) => {
        const isRemoved = this.updatePill(vector, this.activePill)
        if (!isRemoved) return

        this.newPill()
    }
    private updatePill = (vector: Vectorial, pill: Pill) => {
        const didCollide = this.movePill(vector, pill)

        if (!didCollide) return false

        if (pill === this.activePill) this.pills.push(this.activePill)

        pill.absTiles().forEach((tile) => {
            const [bottom, top, right, left] = this.getAligned(tile)

            if (bottom.length + top.length > 2)
                this.popTiles([...bottom, ...top, tile])

            if (right.length + left.length > 2)
                this.popTiles([...right, ...left, tile])
        })

        return true
    }

    private updateTile = (vectorial: Vectorial, tile: Tile) => {
        const didCollide = this.moveTile(vectorial, tile)

        if (!didCollide) return false

        const [bottom, top, right, left] = this.getAligned(tile)

        if (bottom.length + top.length > 2)
            this.popTiles([...bottom, ...top, tile])

        if (right.length + left.length > 2)
            this.popTiles([...right, ...left, tile])

        return true
    }

    private movePill = ({x, y}: Vectorial, pill: Pill) => {
        const otherTiles = [
            ...this.getOtherPills(pill)
                .map((pill) => pill.absTiles())
                .flat(),
            ...this.tiles,
        ]

        pill.move({x, y})

        const isPillCollidingBorders = this.isPillCollidingBorders(pill)
        const isPillCollidingTiles = pill.isColliding(otherTiles)
        const isPillCollidingViruses = pill.isColliding(this.viruses)

        if (
            !isPillCollidingBorders &&
            !isPillCollidingTiles &&
            !isPillCollidingViruses
        )
            return false

        pill.move({x: -x, y: -y})

        const collisionSide =
            x > 0
                ? Direction.Right
                : x < 0
                ? Direction.Left
                : y > 0
                ? Direction.Bottom
                : y < 0
                ? Direction.Top
                : null

        return collisionSide === Direction.Bottom
    }

    private moveTile = ({x, y}: Vectorial, tile: Tile) => {
        tile.move({x, y})

        const isTileCollidingBorders = this.isTileCollidingBorders(tile)
        const isTileCollidingTiles = tile.isColliding(this.getOtherTiles(tile))
        const isTileCollidingPills = tile.isColliding(
            this.pills.map((pill) => pill.absTiles()).flat()
        )
        const isTileCollidingViruses = tile.isColliding(this.viruses)

        if (
            !isTileCollidingBorders &&
            !isTileCollidingTiles &&
            !isTileCollidingPills &&
            !isTileCollidingViruses
        )
            return false

        tile.move({x: -x, y: -y})

        const collisionSide =
            x > 0
                ? Direction.Right
                : x < 0
                ? Direction.Left
                : y > 0
                ? Direction.Bottom
                : y < 0
                ? Direction.Top
                : null

        return collisionSide === Direction.Bottom
    }
}

export default ObjectsManager
