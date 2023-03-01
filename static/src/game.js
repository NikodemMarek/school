import Tile from './objects/tile.js'
import Pawn from './objects/pawn.js'

class Game {
    #dimensions = {}

    #board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ]

    #tiles = []
    #pawns = []

    #isWhite = true

    #isWhiteTurn = true

    #onMove = () => {}

    constructor(isWhite, board, onMove) {
        this.#isWhite = isWhite
        this.#board = board
        this.#onMove = onMove

        this.#dimensions = {
            tileSize: {
                x: 100,
                y: 20,
                z: 100,
            },
            size: {
                x: this.#board[0].length,
                y: this.#board.length,
            },
        }
        this.#dimensions.fullX =
            this.#dimensions.size.y * this.#dimensions.tileSize.z
        this.#dimensions.fullY =
            this.#dimensions.size.x * this.#dimensions.tileSize.x
        this.#dimensions.halfX = this.#dimensions.fullY / 2
        this.#dimensions.halfY = this.#dimensions.fullX / 2

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000)
        if (isWhite) {
            this.camera.position.set(0, 1000, -this.#dimensions.fullY)
        } else {
            this.camera.position.set(0, 1000, this.#dimensions.fullY)
        }
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(0x666666)
        this.renderer.setSize(600, 600)

        this.scene.add(new THREE.AxesHelper(1000))

        const root = document.querySelector('#root')
        root.innerHTML = ''
        root.append(this.renderer.domElement)

        this.#board.forEach((row, y) =>
            row.forEach((tile, x) => {
                const position = {
                    x:
                        x * this.#dimensions.tileSize.x -
                        this.#dimensions.halfX +
                        this.#dimensions.tileSize.x / 2,
                    y: this.#dimensions.tileSize.y / 2,
                    z:
                        y * this.#dimensions.tileSize.z -
                        this.#dimensions.halfY +
                        this.#dimensions.tileSize.z / 2,
                }

                const isWhite =
                    (y % 2 === 0 && x % 2 !== 0) || (y % 2 !== 0 && x % 2 === 0)
                const tileObject = new Tile(
                    position,
                    this.#dimensions.tileSize,
                    isWhite ? 0xdddddd : 0x333333,
                    {x, y},
                    isWhite
                )

                this.#tiles.push(tileObject)
                this.scene.add(tileObject)

                if (tile === 0) return
                const pawnObject = new Pawn(
                    {...position, y: this.#dimensions.tileSize.y},
                    this.#dimensions.tileSize,
                    tile === 1 ? 0xffffff : 0x000000,
                    {x, y},
                    tile === 1
                )

                this.#pawns.push(pawnObject)
                this.scene.add(pawnObject)
            })
        )

        this.raycaster = new THREE.Raycaster()

        document.onclick = this.onclick

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

    moveFromTo = (from, to) => {
        if (this.#board[from.y][from.x] === 0) return

        const pawn = this.#pawns.find(
            (pawn) => pawn.tile.x === from.x && pawn.tile.y === from.y
        )
        if (!pawn) return

        this.#isWhiteTurn = !this.#isWhiteTurn

        this.#board[to.y][to.x] = this.#board[from.y][from.x]
        this.#board[from.y][from.x] = 0

        pawn.tile = to
        pawn.position.set(
            to.x * this.#dimensions.tileSize.x -
                this.#dimensions.halfX +
                this.#dimensions.tileSize.x / 2,
            pawn.position.y,
            to.y * this.#dimensions.tileSize.z -
                this.#dimensions.halfY +
                this.#dimensions.tileSize.z / 2
        )
    }

    #selected = null
    onclick = (event) => {
        this.raycaster.setFromCamera(
            new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            ),
            this.camera
        )

        const getAvailablePositions = (pawnPosition) => {
            if (!pawnPosition) return []

            const {x, y} = pawnPosition

            const availablePositions = [
                [
                    {x: x - 1, y: y - 1},
                    {x: x - 2, y: y - 2},
                ],
                [
                    {x: x - 1, y: y + 1},
                    {x: x - 2, y: y + 2},
                ],
                [
                    {x: x + 1, y: y - 1},
                    {x: x + 2, y: y - 2},
                ],
                [
                    {x: x + 1, y: y + 1},
                    {x: x + 2, y: y + 2},
                ],
            ]

            const moveablePositions = availablePositions.reduce(
                (acc, [closePosition, farPosition]) => {
                    if (
                        closePosition.x < 0 ||
                        closePosition.x >= this.#board[0].length ||
                        closePosition.y < 0 ||
                        closePosition.y >= this.#board.length
                    )
                        return acc

                    if (this.#board[closePosition.y][closePosition.x] === 0)
                        return [...acc, closePosition]

                    if (
                        farPosition.x < 0 ||
                        farPosition.x >= this.#board[0].length ||
                        farPosition.y < 0 ||
                        farPosition.y >= this.#board.length
                    )
                        return acc

                    if (
                        [false, !this.#isWhite, this.#isWhite][
                            this.#board[closePosition.y][closePosition.x]
                        ] &&
                        this.#board[farPosition.y][farPosition.x] === 0
                    )
                        return [...acc, farPosition]

                    return acc
                },
                []
            )

            return moveablePositions
        }

        const resetColors = () =>
            this.#tiles.forEach((tile) => {
                if (tile.isWhite) tile.material.color.set(0xdddddd)
                else tile.material.color.set(0x333333)
            })

        const intersectsPawns = this.raycaster.intersectObjects(
            this.#isWhiteTurn === this.#isWhite
                ? this.#pawns.filter((pawn) => pawn.isWhite === this.#isWhite)
                : []
        )

        if (intersectsPawns.length > 0) {
            const pawn = intersectsPawns[0].object.tile
            this.#selected = pawn

            resetColors()

            getAvailablePositions(this.#selected)
                .map(({x, y}) =>
                    this.#tiles.find(
                        (tile) => tile.tile.x === x && tile.tile.y === y
                    )
                )
                .forEach((tile) => tile.material.color.set(0x00ff00))
        }

        const intersectsTiles = this.raycaster.intersectObjects(
            getAvailablePositions(this.#selected).map(({x, y}) =>
                this.#tiles.find(
                    (tile) => tile.tile.x === x && tile.tile.y === y
                )
            )
        )
        if (intersectsTiles.length > 0) {
            const tile = intersectsTiles[0].object.tile

            resetColors()

            this.moveFromTo(this.#selected, tile)
            this.#onMove?.(this.#selected, tile)

            this.#selected = null
        }
    }
}

export default Game
