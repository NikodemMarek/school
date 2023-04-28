import {Direction, Vectorial} from './types'
import {Pill, Tile, Virus} from './objects'

class ObjectsManager {
    /**
     * The active pill.
     * Can be moved and rotated by a player.
     */
    public activePill: Pill | undefined

    /**
     * Adds the first pill.
     *
     * @param size - Size of the board in tiles
     * @param tiles - Tiles on the board
     * @param pills - Pills on the board
     * @param viruses - Viruses on the board
     */
    constructor(
        private size: Vectorial,
        public tiles: Tile[],
        public pills: Pill[],
        public viruses: Virus[],
    ) {}

    /**
     * Returns the tiles that are not the provided pill.
     *
     * @param pill - Pill to exclude
     * @returns Pills that are not the provided pill
     */
    private getOtherPills = (pill: Pill) => this.pills.filter((p) => p !== pill)
    /**
     * Returns the tiles that are not the provided tile.
     *
     * @param tile - Tile to exclude
     * @returns Tiles that are not the provided tile
     */
    private getOtherTiles = (tile: Tile) => this.tiles.filter((t) => t !== tile)

    /**
     * Checks if the pill is colliding with borders.
     *
     * @param pill - Pill to check
     * @returns Is the pill is colliding with borders
     */
    private isPillCollidingBorders = (pill: Pill) =>
        pill.tiles.some(({x, y}) => {
            const [px, py] = [pill.x + x, pill.y + y]
            return this.isTileCollidingBorders({x: px, y: py} as Tile)
        })
    /**
     * Checks if the tile is colliding with borders.
     *
     * @param param0 - Tile to check
     * @returns - Is the tile is colliding with borders
     */
    private isTileCollidingBorders = ({x, y}: Tile) =>
        x < 0 || x >= this.size.x || y < 0 || y >= this.size.y

    /**
     * Finds the tiles that are aligned with the provided tile and have the same color.
     *
     * @param param0 - Tile to check
     * @returns Arrays of tiles that are aligned with the provided tile and have the same color
     */
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

    /**
     * Removes the provided tiles from the board.
     * Splits the pills that are colliding with the provided tiles.
     *
     * @param tiles - Tiles to remove
     */
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

    /**
     * Moves the active pill by the provided vector.
     * Moves other pills and tiles.
     * Returns the tiles that have been removed.
     *
     * @param vector - Vector to move the active pill by
     * @returns Tiles that have been removed
     */
    public update = (vector: Vectorial) => {
        const pills = this.activePill? [this.activePill, ...this.pills] : this.pills

        const didMove = [...pills, ...this.tiles]
            .sort((a, b) => {
                a = a instanceof Pill ? a.absTiles().sort((a, b) => b.y - a.y)[0] : a
                b = b instanceof Pill ? b.absTiles().sort((a, b) => b.y - a.y)[0] : b

                return b.y - a.y
            })
            .map((obj) => !(obj instanceof Pill ? this.movePill(vector, obj) : this.moveTile(vector, obj)))
            .some(v => v)

        if (didMove) return false

        if (this.activePill) {
            this.pills.push(this.activePill)
            this.activePill = undefined
        }

        const toPop = new Set<Tile>()
        ;[...pills.map((pill) => pill.absTiles()).flat(), ...this.tiles]
            .forEach((obj) => {
                if (toPop.has(obj)) return

                const [bottom, top, right, left] = this.getAligned(obj)

                if (bottom.length + top.length > 2)
                    [...bottom, ...top, obj].forEach(toPop.add, toPop)
                if (right.length + left.length > 2)
                    [...right, ...left, obj].forEach(toPop.add, toPop)
            })

        const toPopArray = Array.from(toPop)

        this.popTiles(toPopArray)
        return toPopArray
    }

    /**
     * Rotate the active pill by the provided number of 90 degree rotations.
     * Prevents the pill from rotating if it collides with borders or other tiles / pills.
     *
     * @param by - Number of 90 degree rotations to rotate the active pill by
     */
    public rotateActivePill = (by: number) => {
        if (!this.activePill) return true

        this.activePill.rotate(by)

        if (
            this.isPillCollidingBorders(this.activePill) ||
            this.activePill.isColliding([
                ...this.getOtherPills(this.activePill).map(p => p.absTiles()).flat(1),
                ...this.tiles,
                ...this.viruses,
            ])
        ) {
            this.activePill.rotate(-by)
            return false
        }

        return true
    }

    /**
     * Rotate the active pill by the provided number of 90 degree rotations.
     * Moves the active pill by the provided vector.
     * Prevents the pill from rotating if it collides with borders or other tiles / pills.
     *
     * @param by - Number of 90 degree rotations to rotate the active pill by
     * @param param0 - Vector to move the pill by
     * @returns Did rotate
     */
    public rotateAndMoveActivePill = (by: number, {x, y}: Vectorial) => {
        if (!this.activePill) return false

        this.activePill.move({x, y})
        this.activePill.rotate(by)

        const otherTiles = [
            ...this.pills
                .map((pill) => pill.absTiles())
                .flat(),
            ...this.tiles,
        ]

        const isPillCollidingBorders = this.isPillCollidingBorders(this.activePill)
        const isPillCollidingTiles = this.activePill.isColliding(otherTiles)
        const isPillCollidingViruses = this.activePill.isColliding(this.viruses)

        if (
            !isPillCollidingBorders &&
            !isPillCollidingTiles &&
            !isPillCollidingViruses
        )
            return false

        this.activePill.move({x: -x, y: -y})
        this.activePill.rotate(-by)

        return true
    }

    /**
     * Moves the pill by the provided vector.
     * Prevents the pill from moving if it collides with borders or other tiles / pills.
     *
     * @param param0 - Vector to move the pill by
     * @param pill - Pill to move
     * @returns Whether the pill has collided with borders or other tiles / pills
     */
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

    /**
     * Moves the tile by the provided vector.
     * Prevents the tile from moving if it collides with borders or other tiles / pills.
     *
     * @param param0 - Vector to move the tile by
     * @param tile - Tile to move
     * @returns Whether the tile has collided with borders or other tiles / pills
     */
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

        return true

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
