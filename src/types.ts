enum Color {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
}

enum Direction {
    Top = 0,
    Bottom = 1,
    Right = 2,
    Left = 3,
}

export {Color, Direction}

interface Vectorial {
    x: number
    y: number
}

interface Collidable {
    isColliding: (points: Vectorial[]) => boolean
}
interface Moveable {
    move: (vector: Vectorial) => void
}
interface Rotatable {
    rotate: (by: number) => void
}

export type {Collidable, Moveable, Rotatable, Vectorial}
