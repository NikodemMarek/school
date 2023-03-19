import {Color} from './types'
import {Point, Tile, Pill} from './objects'

const pill = new Pill(0, 0, [
    new Tile(0, 0, Color.Red),
    new Tile(1, 0, Color.Green),
    new Tile(2, 0, Color.Blue),
])

document.addEventListener('keydown', ({key}) => {
    console.log(JSON.stringify(pill, null, 2))
    const move = {
        a: new Point(-1, 0),
        d: new Point(1, 0),
        w: new Point(0, -1),
        s: new Point(0, 1),
    }[key]

    if (move) return pill.move(move)

    const rotate = {
        q: -1,
        e: 1,
        f: 2,
    }[key]

    if (rotate) return pill.rotate(rotate)
})
