/**
 * Colors of objects in the game.
 */
enum Color {
    Red = 'red',
    Blue = 'blue',
    Yellow = 'yellow'
}

/**
 * Directions.
 */
enum Direction {
    Top = 0,
    Bottom = 1,
    Right = 2,
    Left = 3,
}

export {Color, Direction}

/**
 * A point in 2D space.
 */
interface Vectorial {
    x: number
    y: number
}

/**
 * An object that can be collided with.
 */
interface Collidable {
    isColliding: (points: Vectorial[]) => boolean
}
/**
 * An object that can be moved.
 */
interface Moveable {
    move: (vector: Vectorial) => void
}
/**
 * An object that can be rotated.
 */
interface Rotatable {
    rotate: (by: number) => void
}

export type {Collidable, Moveable, Rotatable, Vectorial}
