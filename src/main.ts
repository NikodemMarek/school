import ObjectsManager, {Point} from './objects'
import Board from './board'

const game = document.createElement('div')
document.body.appendChild(game)

const size = new Point(10, 20)

const board = new Board(size, game)

const manager = new ObjectsManager(new Point(10, 20), [], [])

board.refresh(manager.tiles, [manager.activePill, ...manager.pills])

document.addEventListener('keydown', ({key}) => {
    ;(() => {
        const move = {
            a: new Point(-1, 0),
            d: new Point(1, 0),
            // w: new Point(0, -1),
            s: new Point(0, 1),
        }[key]

        if (move) return manager.moveActivePill(move)

        const rotate = {
            q: -1,
            e: 1,
            f: 2,
        }[key]

        if (rotate) return manager.rotateActivePill(rotate)
    })()

    board.refresh(manager.tiles, [manager.activePill, ...manager.pills])
})

setInterval(() => {
    manager.update(new Point(0, 1))
    board.refresh(manager.tiles, [manager.activePill, ...manager.pills])
}, 300)
