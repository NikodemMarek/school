enum Color {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
}

export {Color}

interface IPoint {
    x: number
    y: number
}

interface ITile extends IPoint {
    color: Color
}

interface IPill extends IPoint {
    tiles: ITile[]
}

export type {IPoint, ITile, IPill}
