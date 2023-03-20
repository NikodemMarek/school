import {Color, IPill, ITile} from './types'
import {Point, Tile, Pill} from './objects'
import Board from './board'

const pill = new Pill(3, 3, [
    new Tile(0, 0, Color.Red),
    new Tile(1, 0, Color.Green),
    new Tile(2, 0, Color.Blue),
])

const game = document.createElement('div')
document.body.appendChild(game)

const board = new Board(game, new Point(10, 20))

const tiles: ITile[] = []
const pills: IPill[] = []

pills.push(pill)

board.refresh(tiles, pills)

document.addEventListener('keydown', ({key}) => {
    ;;(() => {
        const move = {
            a: new Point(-1, 0),
            d: new Point(1, 0),
            // w: new Point(0, -1),
            s: new Point(0, 1),
        }[key]

        if (move) return pill.move(move)

        const rotate = {
            q: -1,
            e: 1,
            f: 2,
        }[key]

        if (rotate) return pill.rotate(rotate)
    })()

    board.refresh(tiles, pills)
})

setInterval(() => {
    pill.move(new Point(0, 1))
    board.refresh(tiles, pills)
}, 1000)
