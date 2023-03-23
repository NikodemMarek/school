import {Pill} from './objects'
import {Pillable, Vectorial, Tileable} from './types'

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

    public tile = ({x, y, color}: Tileable) => {
        const tile = this.board.querySelector(`[data-x="${x}"][data-y="${y}"]`)

        if (!tile) return
        ;(tile as HTMLDivElement).style.backgroundColor = color
    }

    public pill = ({x, y, tiles}: Pillable) => {
        tiles.forEach(({x: rx, y: ry, color}) =>
            this.tile({x: x + rx, y: y + ry, color})
        )
    }

    public refresh = (tiles: Tileable[], pills: Pillable[]) => {
        this.empty()
        tiles.forEach((tile) => this.tile(tile))
        pills.forEach((pill) => this.pill(pill))
    }
}

export default Board
