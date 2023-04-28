import Board from './board'
import Loader from './loader'
import {Pill, Point, Tile, Virus} from './objects'
import ObjectsManager from './objects-manager'
import Scoreboard from './scoreboard'
import {Color} from './types'

class GameManager {
    private size: Point

    private timer

    private board: Board
    private manager: ObjectsManager

    private scoreboard: Scoreboard

    private toPop: Tile[] = []

    private nextPill: Pill
    private waitForPill = false

    constructor(size: Point, loader: Loader) {
        this.size = size

        this.manager = new ObjectsManager(
            this.size,
            [],
            [],
            [this.newVirus(), this.newVirus(), this.newVirus()]
        )
        this.board = new Board(
            this.size,
            loader,
        )

        this.board.dance = true

        document.addEventListener('keydown', ({key}) => {
            ;(() => {
                if (!this.manager.activePill) return

                const move = {
                    a: new Point(-1, 0),
                    ArrowLeft: new Point(-1, 0),
                    d: new Point(1, 0),
                    ArrowRight: new Point(1, 0),
                    s: new Point(0, 1),
                    ArrowDown: new Point(0, 1),
                }[key]

                if (move)
                    this.manager.rotateAndMoveActivePill(0, move)

                const isVert = this.manager.activePill.tiles[0].y === this.manager.activePill.tiles[1].y
                const isReversed = isVert? this.manager.activePill.tiles[0].x > this.manager.activePill.tiles[1].x: this.manager.activePill.tiles[0].y < this.manager.activePill.tiles[1].y
                const [rotate, moveBy] = {
                    q: [-1, new Point(0, 0)],
                    w: [-1, new Point(0, 0)],
                    ArrowUp: isReversed
                        ? isVert? [-1, new Point(-1, -1)]: [-1, new Point(0, 1)]
                        : isVert? [-1, new Point(0, 0)]: [-1, new Point(1, 0)],
                    e: [1, new Point(0, 0)],
                    f: [2, new Point(0, 0)],
                    Shift: isReversed
                        ? isVert? [1, new Point(-1, 0)]: [1, new Point(1, 1)]
                        : isVert? [1, new Point(0, -1)]: [1, new Point(0, 0)],
                }[key] || [0, new Point(0, 0)]

                if (rotate && moveBy) {
                    if (!this.manager.rotateAndMoveActivePill(rotate as number, moveBy as Point)) return

                    const [r, m] = {
                        ArrowUp: isReversed
                            ? isVert? [0, new Point(0, 0)]: [-1, new Point(-1, 1)]
                            : isVert? [0, new Point(0, 0)]: [-1, new Point(0, 0)],
                        Shift: isReversed
                            ? isVert? [0, new Point(0, 0)]: [1, new Point(0, 1)]
                            : isVert? [0, new Point(0, 0)]: [1, new Point(-1, 0)],
                    }[key] || [0, new Point(0, 0)]
                    this.manager.rotateAndMoveActivePill(r as number, m as Point)
                }
            })()

            this.refresh()
        })

        this.scoreboard = new Scoreboard(this.board.score)
        this.board.virusCount(this.manager.viruses.length)

        const colors = Object.values(Color)
        this.nextPill = new Pill(4, 0, [
            new Tile(0, 0, colors[Math.floor(Math.random() * colors.length)]),
            new Tile(1, 0, colors[Math.floor(Math.random() * colors.length)]),
        ])
        this.board.nextPill(this.nextPill)
        this.newPill()

        this.timer = setInterval(this.update, 300)
    }

    /**
     * Creates a new pill.
     */
    private newPill = () => {
        if (this.waitForPill) return

        this.waitForPill = true

        this.board.throw(this.nextPill).then((pill) => {
            this.manager.activePill = pill as Pill
            this.waitForPill = false
            this.board.nextPill(this.nextPill)
        })

        const colors = Object.values(Color)
        const tiles = [
            new Tile(0, 0, colors[Math.floor(Math.random() * colors.length)]),
            new Tile(1, 0, colors[Math.floor(Math.random() * colors.length)]),
        ]

        this.nextPill = new Pill(4, 0, tiles)
    }

    private newVirus = () => {
        const colors = Object.values(Color)
        const color = colors[Math.floor(Math.random() * colors.length)]

        return new Virus(
            Math.floor(Math.random() * this.size.x),
            Math.floor((Math.random() * this.size.y * 2) / 3 + this.size.y / 3),
            color
        )
    }

    private update = () => {
        const viruses = this.manager.viruses.length

        const toPop = this.manager.update(new Point(0, 1))
        if (toPop) {
            this.toPop.push(...toPop)

            if (this.toPop.length === 0) this.newPill()
        }

        this.refresh()

        const killed = viruses - this.manager.viruses.length
        this.scoreboard.addKills(killed)
        this.board.virusCount(this.manager.viruses.length)

        if (
            [
                ...this.manager.pills.map((pill) => pill.absTiles()).flat(),
                ...this.manager.tiles,
            ].some((tile) => tile.y === 0)
        )
            return this.gameOver(false)

        if (this.manager.viruses.length > 0) return

        this.gameOver(true)
    }

    private refresh = () => {
        this.board.refresh(
            this.manager.tiles,
            this.manager.activePill? [this.manager.activePill, ...this.manager.pills]: this.manager.pills,
            this.manager.viruses,
            this.toPop
        )

        this.toPop = []
    }

    private gameOver = (won: boolean) => {
        if (won) this.scoreboard.updateHighscore()

        clearInterval(this.timer)

        this.board.finish(won)
    }
}

export default GameManager
