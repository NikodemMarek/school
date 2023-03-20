import {Color} from './types'
import ObjectsManager, {Point, Tile, Pill} from './objects'
import Board from './board'

const game = document.createElement('div')
document.body.appendChild(game)

const size = new Point(10, 20)

const board = new Board(size, game)

const manager = new ObjectsManager(
    new Point(10, 20),
    [],
    new Pill(3, 3, [
        new Tile(0, 0, Color.Red),
        new Tile(1, 0, Color.Green),
        new Tile(2, 0, Color.Blue),
    ])
)

board.refresh(manager.tiles, [manager.pill])

document.addEventListener('keydown', ({key}) => {
    ;(() => {
        const move = {
            a: new Point(-1, 0),
            d: new Point(1, 0),
            // w: new Point(0, -1),
            s: new Point(0, 1),
        }[key]

        if (move) return manager.movePill(move)

        const rotate = {
            q: -1,
            e: 1,
            f: 2,
        }[key]

        if (rotate) return manager.rotatePill(rotate)
    })()

    board.refresh(manager.tiles, [manager.pill])
})

setInterval(() => {
    manager.moveAll(new Point(0, 1))
    board.refresh(manager.tiles, [manager.pill])
}, 1000)
