import Tile from './objects/tile.js'
import Pawn from './objects/pawn.js'

class Game {
    #tiles = []
    #pawns = []

    #isWhite = true

    #endTurn = () => {}

    constructor(isWhite, board, canMove, endTurn) {
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

        const tileSize = {
            x: 100,
            y: 20,
            z: 100,
        }

        const size = {
            x: this.board[0].length,
            y: this.board.length,
        }

        this.#isWhite = isWhite

        const [fullX, fullY] = [size.x * tileSize.x, size.y * tileSize.z]
        const [halfX, halfY] = [fullX / 2, fullY / 2]

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000)
        if (isWhite) {
            this.camera.position.set(0, 1000, -fullY)
        } else {
            this.camera.position.set(0, 1000, fullY)
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
                    x: x * tileSize.x - halfX + tileSize.x / 2,
                    y: tileSize.y / 2,
                    z: y * tileSize.z - halfY + tileSize.z / 2,
                }

                const isWhite =
                    (y % 2 === 0 && x % 2 !== 0) || (y % 2 !== 0 && x % 2 === 0)
                const tileObject = new Tile(
                    position,
                    tileSize,
                    isWhite ? 0xdddddd : 0x333333,
                    {x, y},
                    isWhite
                )

                this.#tiles.push(tileObject)
                this.scene.add(tileObject)

                if (tile === 0) return
                const pawnObject = new Pawn(
                    {...position, y: tileSize.y},
                    tileSize,
                    tile === 1 ? 0xffffff : 0x000000,
                    {x, y},
                    tile === 1
                )

                this.#pawns.push(pawnObject)
                this.scene.add(pawnObject)
            })
        )

        this.raycaster = new THREE.Raycaster()

        this.render()

        if (!canMove) return

        this.#endTurn = endTurn
        document.onclick = this.onclick
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
                        closePosition.x >= this.board[0].length ||
                        closePosition.y < 0 ||
                        closePosition.y >= this.board.length
                    )
                        return acc

                    if (this.board[closePosition.y][closePosition.x] === 0)
                        return [...acc, closePosition]

                    if (
                        farPosition.x < 0 ||
                        farPosition.x >= this.board[0].length ||
                        farPosition.y < 0 ||
                        farPosition.y >= this.board.length
                    )
                        return acc

                    if (
                        [false, !this.#isWhite, this.#isWhite][
                            this.board[closePosition.y][closePosition.x]
                        ] &&
                        this.board[farPosition.y][farPosition.x] === 0
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
            this.#pawns.filter((pawn) => pawn.isWhite === this.#isWhite)
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

            this.board[tile.y][tile.x] =
                this.board[this.#selected.y][this.#selected.x]
            this.board[this.#selected.y][this.#selected.x] = 0

            const pawn = this.#pawns.find(
                (pawn) =>
                    pawn.tile.x === this.#selected.x &&
                    pawn.tile.y === this.#selected.y
            )

            this.#selected = tile

            if (!pawn) return

            pawn.tile = tile
            const tilePos = this.#tiles.find(
                (t) => t.tile.x === tile.x && t.tile.y === tile.y
            ).position
            pawn.position.set(tilePos.x, pawn.position.y, tilePos.z)

            this.#selected = null
            this.#endTurn(this.board)
        }
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
