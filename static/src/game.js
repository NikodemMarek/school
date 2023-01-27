import Tile from './objects/tile.js'
import Pawn from './objects/pawn.js'

class Game {
    #tileSize = {
        x: 100,
        y: 20,
        z: 100,
    }

    #tiles = []
    #pawns = []

    constructor(isWhite, board) {
        this.board = board || [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]

        const size = {
            x: this.board[0].length,
            y: this.board.length,
        }

        const [fullX, fullY] = [
            size.x * this.#tileSize.x,
            size.y * this.#tileSize.z,
        ]
        const [halfX, halfY] = [fullX / 2, fullY / 2]

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000)
        if (isWhite) {
            this.camera.position.set(0, 1000, fullY)
        } else {
            this.camera.position.set(0, 1000, -fullY)
        }
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(0x666666)
        this.renderer.setSize(600, 600)

        this.scene.add(new THREE.AxesHelper(1000))

        const root = document.querySelector('#root')
        root.innerHTML = ''
        root.append(this.renderer.domElement)

        this.board.forEach((row, y) =>
            row.forEach((tile, x) => {
                const position = {
                    x: x * this.#tileSize.x - halfX + this.#tileSize.x / 2,
                    y: this.#tileSize.y / 2,
                    z: y * this.#tileSize.z - halfY + this.#tileSize.z / 2,
                }

                const tileObject = new Tile(
                    position,
                    this.#tileSize,
                    (y % 2 === 0 && x % 2 !== 0) || (y % 2 !== 0 && x % 2 === 0)
                        ? 0xdddddd
                        : 0x333333
                )

                this.#tiles.push(tileObject)
                this.scene.add(tileObject)

                if (tile === 0) return
                const pawnObject = new Pawn(
                    {...position, y: this.#tileSize.y},
                    this.#tileSize,
                    tile === 1 ? 0x000000 : 0xffffff
                )

                this.#pawns.push(pawnObject)
                this.scene.add(pawnObject)
            })
        )

        this.render()
    }

    render = () => {
        // Update camera aspect ratio.
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        // Render the scene.
        requestAnimationFrame(this.render)
        this.renderer.render(this.scene, this.camera)
    }
}

export default Game
