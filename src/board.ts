import {Pill, Tile, Virus} from './objects'
import {Vectorial} from './types'

const TILE_SIZE = 40

class Board {
    private board: HTMLDivElement

    constructor(private size: Vectorial, container: HTMLDivElement) {
        this.board = container

        this.board.style.width = `${this.size.x * TILE_SIZE}px`
        this.board.style.height = `${this.size.y * TILE_SIZE}px`
        this.board.classList.add('board')

        this.empty()
    }

    private empty = () =>
        (this.board.innerHTML = Array(this.size.y)
            .fill(0)
            .map((_, y) =>
                Array(this.size.x)
                    .fill(0)
                    .reduce(
                        (acc, _, x) =>
                            `${acc}<div class="tile" style="width: ${TILE_SIZE}px; height: ${TILE_SIZE}px; left: ${
                                x * TILE_SIZE
                            }px; top: ${
                                y * TILE_SIZE
                            }px;" data-x=${x} data-y=${y}></div>`,
                        ''
                    )
            )
            .join(''))

    public tile = ({x, y, color}: Tile) => {
        const tile = this.board.querySelector(`[data-x="${x}"][data-y="${y}"]`)

        if (!tile) return
        ;(tile as HTMLDivElement).style.backgroundColor = color
    }

    public pill = (pill: Pill) => {
        const absTiles = pill.absTiles()
        const xy = absTiles[0]?.x - absTiles[1]?.x !== 0
        absTiles.sort((a, b) => (xy ? a.x - b.x : a.y - b.y))

        absTiles.forEach(({x, y, color}, i) => {
            let radius = '0'
            if (xy) radius = i === 0 ? '50% 0 0 50%' : '0 50% 50% 0'
            else
                radius =
                    i === absTiles.length - 1 ? '0 0 50% 50%' : '50% 50% 0 0'

            const tile = this.board.querySelector(
                `[data-x="${x}"][data-y="${y}"]`
            )

            if (!tile) return
            ;(
                tile as HTMLDivElement
            ).innerHTML = `<div class="pill" style="background-color: ${color}; border-radius: ${radius};"></div>`
        })
    }

    public virus = (virus: Virus) => {
        const tile = this.board.querySelector(
            `[data-x="${virus.x}"][data-y="${virus.y}"]`
        )

        if (!tile) return
        ;(
            tile as HTMLDivElement
        ).innerHTML = `<div class="virus" style="background-color: ${virus.color}; border-radius: 50%;"></div>`
    }

    public refresh = (tiles: Tile[], pills: Pill[], viruses: Virus[]) => {
        this.empty()
        tiles.forEach((tile) => this.tile(tile))
        pills.forEach((pill) => this.pill(pill))
        viruses.forEach((virus) => this.virus(virus))
    }
}

export default Board
