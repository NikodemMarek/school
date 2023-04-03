import {Point, Virus} from './objects'
import ObjectsManager from './objects-manager'
import Board from './board'
import {Color} from './types'

const game = document.createElement('div')
document.body.appendChild(game)

const size = new Point(10, 20)

const board = new Board(size, game)

const newVirus = () => {
    const colors = Object.values(Color)
    const color = colors[Math.floor(Math.random() * colors.length)]

    return new Virus(
        Math.floor(Math.random() * size.x),
        Math.floor((Math.random() * size.y * 2) / 3 + size.y / 3),
        color
    )
}

const manager = new ObjectsManager(
    new Point(10, 20),
    [],
    [],
    [newVirus(), newVirus(), newVirus()]
)

board.refresh(
    manager.tiles,
    [manager.activePill, ...manager.pills],
    manager.viruses
)

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

    board.refresh(
        manager.tiles,
        [manager.activePill, ...manager.pills],
        manager.viruses
    )
})

setInterval(() => {
    manager.update(new Point(0, 1))
    board.refresh(
        manager.tiles,
        [manager.activePill, ...manager.pills],
        manager.viruses
    )
}, 300)
