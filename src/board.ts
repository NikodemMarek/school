import {IPoint} from './types'

const TILE_SIZE = 50

class Board {
    private board: HTMLDivElement
    private size: IPoint

    constructor(container: HTMLDivElement, size: IPoint) {
        this.board = container
        this.size = size

        this.board.style.width = `${this.size.x * TILE_SIZE}px`
        this.board.style.height = `${this.size.y * TILE_SIZE}px`
        this.board.classList.add('board')

        this.drawFrame()
    }

    drawFrame = () =>
        (this.board.innerHTML = Array(this.size.y)
            .fill(0)
            .map((_, y) =>
                Array(this.size.x)
                    .fill(0)
                    .reduce(
                        (acc, _, x) =>
                            `${acc}<div class="tile" style="width: ${TILE_SIZE}px; height: ${TILE_SIZE}px; left: ${
                                x * TILE_SIZE
                            }px; top: ${y * TILE_SIZE}px;"></div>`,
                        ''
                    )
            )
            .join(''))
}

export default Board
