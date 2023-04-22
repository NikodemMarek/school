import Loader from './loader'
import {Pill, Tile, Virus} from './objects'
import {Vectorial} from './types'

const TILE_SIZE = 25

class Board {
    private board: HTMLDivElement

    constructor(private size: Vectorial, private loader: Loader, private virusPositions: Vectorial[]) {
        document.body.innerHTML = `
            <style>
                html {
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  background: #fff;
                }

                body {
                    background-color: #000;
                    color: #fff;
                    width: 1280px;
                    height: 768px;
                    position: relative;
                    margin: 0;
                    padding: 0;
                    background-size: cover;
                    background-image: url(${this.loader.get('pf.png').src})
                }
                
                #overlay {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    display: none;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-image: url(${this.loader.get('go.png').src})
                }
                
                #left {
                    width: 20%;
                    height: 100%;
                }
                
                #game {
                    position: absolute;
                    top: 195px;
                    left: 545px;
                    width: ${size.x * TILE_SIZE}px;
                    height: ${size.y * TILE_SIZE}px;
                }

                #right {
                    width: 20%;
                    height: 100%;
                }

                .tile {
                  position: absolute;
                  box-sizing: border-box;
                  background-size: cover;
                }
            </style>

            <div id="overlay"></div>

            <div id="left">
                <div id="scoreboard"></div>
            </div>

            <div id="game"></div>

            <div id="right">
            </div>
        `

        this.board = document.querySelector('#game') as HTMLDivElement

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

    public tile = ({x, y, color}: Tile) => {
        const tile = this.board.querySelector(`[data-x="${x}"][data-y="${y}"]`)

        if (!tile) return
        ;(tile as HTMLDivElement).style.backgroundImage = `url(${this.loader.get(`${color}_dot.png`).src})`
    }

    public pill = (pill: Pill) => {
        const absTiles = pill.absTiles()
        const xy = absTiles[0]?.x - absTiles[1]?.x !== 0
        absTiles.sort((a, b) => (xy ? a.x - b.x : a.y - b.y))

        absTiles.forEach(({x, y, color}, i) => {
            let radius = '0'
            if (xy) radius = i === 0 ? 'left' : 'right'
            else
                radius =
                    i === absTiles.length - 1 ? 'down' : 'up'

            const tile = this.board.querySelector(
                `[data-x="${x}"][data-y="${y}"]`
            )

            if (!tile) return
            ;(
                tile as HTMLDivElement
            ).style.backgroundImage = `url(${this.loader.get(`${color}_${radius}.png`).src})`
        })
    }

    public virus = (virus: Virus) => {
        const tile = this.board.querySelector(
            `[data-x="${virus.x}"][data-y="${virus.y}"]`
        )

        if (!tile) return
        ;(
            tile as HTMLDivElement
        ).style.backgroundImage = `url(${this.loader.get(`${virus.color}_smvirus`).src})`
    }

    public refresh = (
        tiles: Tile[],
        pills: Pill[],
        viruses: Virus[],
        toPop: Tile[]
    ) => {
        this.empty()
        tiles.forEach((tile) => this.tile(tile))
        pills.forEach((pill) => this.pill(pill))
        viruses.forEach((virus) => this.virus(virus))

        toPop.forEach(({x, y, color}) => {
            const tile = this.board.querySelector(
                `[data-x="${x}"][data-y="${y}"]`
            )

            if (!tile) return

            const virus = this.virusPositions.find((v) => v.x === x && v.y === y)

            if (virus)
                this.virusPositions = this.virusPositions.filter(v => v !== virus)

            ;(
                tile as HTMLDivElement
            ).style.backgroundImage = virus? `url(${this.loader.get(`${color}_x.png`).src})`: `url(${this.loader.get(`${color}_o.png`).src})`
        })
    }

    public update = (delta: number) => Object.keys(this.loader.animatedSprites).forEach(key => this.loader.animatedSprites[key].update(delta))

    public finish = (won: boolean) => {
        const overlay = document.querySelector('#overlay') as HTMLDivElement

        overlay.style.backgroundImage = `url(${this.loader.get(`${won ? 'sc' : 'go'}.png`).src})`
        overlay.style.display = 'flex'
    }
}

export default Board
