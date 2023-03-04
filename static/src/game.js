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
    switchTurn = (isWhiteTurn) => {
        this.#isWhiteTurn = isWhiteTurn
        this.#selected = null
        this.resetColors()
    }

    #onMove = () => {}

    constructor(isWhite, board, onMove) {
        this.#isWhite = isWhite
        this.#board = board
        this.#onMove = onMove

        this.#dimensions = {
            tileSize: 100,
            size: {
                x: this.#board[0].length,
                y: this.#board.length,
            },
        }
        this.#dimensions.fullX =
            this.#dimensions.size.y * this.#dimensions.tileSize
        this.#dimensions.fullY =
            this.#dimensions.size.x * this.#dimensions.tileSize
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

        const mats = {
            'tile-white': new THREE.TextureLoader().load(
                '/assets/tile-white.png'
            ),
            'tile-black': new THREE.TextureLoader().load(
                '/assets/tile-black.jpg'
            ),
            'pawn-white-bottom': new THREE.TextureLoader().load(
                '/assets/pawn-white-bottom.png'
            ),
            'pawn-white-top': new THREE.TextureLoader().load(
                '/assets/pawn-white-top.png'
            ),
            'pawn-black-bottom': new THREE.TextureLoader().load(
                '/assets/pawn-black-bottom.png'
            ),
            'pawn-black-top': new THREE.TextureLoader().load(
                '/assets/pawn-black-top.png'
            ),
        }

        const root = document.querySelector('#root')
        root.innerHTML = ''
        root.append(this.renderer.domElement)

        this.#board.forEach((row, y) =>
            row.forEach((tile, x) => {
                const position = {
                    x:
                        x * this.#dimensions.tileSize -
                        this.#dimensions.halfX +
                        this.#dimensions.tileSize / 2,
                    y: 0,
                    z:
                        y * this.#dimensions.tileSize -
                        this.#dimensions.halfY +
                        this.#dimensions.tileSize / 2,
                }

                const isWhite =
                    (y % 2 === 0 && x % 2 !== 0) || (y % 2 !== 0 && x % 2 === 0)
                const tileObject = new Tile(
                    position,
                    this.#dimensions.tileSize,
                    {x, y},
                    isWhite,
                    mats
                )

                this.#tiles.push(tileObject)
                this.scene.add(tileObject)

                if (tile === 0) return
                const pawnObject = new Pawn(
                    position,
                    this.#dimensions.tileSize,
                    {x, y},
                    tile === 1,
                    mats
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

        TWEEN.update()

        // Render the scene.
        requestAnimationFrame(this.render)
        this.renderer.render(this.scene, this.camera)
    }

    resetColors = () => {
        this.#tiles.forEach((tile) => tile.highlight(false))
        this.#pawns.forEach((pawn) => pawn.highlight(false))
    }

    moveFromTo = (from, to) => {
        if (!from || !to) return
        if (this.#board[from.y][from.x] === 0) return

        const pawn = this.#pawns.find(
            (pawn) => pawn.tile.x === from.x && pawn.tile.y === from.y
        )
        if (!pawn) return

        this.#board[to.y][to.x] = this.#board[from.y][from.x]
        this.#board[from.y][from.x] = 0

        pawn.tile = to
        new TWEEN.Tween(pawn.position)
            .to(
                {
                    x:
                        to.x * this.#dimensions.tileSize -
                        this.#dimensions.halfX +
                        this.#dimensions.tileSize / 2,
                    z:
                        to.y * this.#dimensions.tileSize -
                        this.#dimensions.halfY +
                        this.#dimensions.tileSize / 2,
                },
                500
            )
            .easing(TWEEN.Easing.Cubic.In)
            .start()

        const off = from.x - to.x
        Array(Math.abs(off) - 1)
            .fill(null)
            .map((_, i) => ({
                x: from.x + (off > 0 ? -1 : 1) * (i + 1),
                y: from.y + (off > 0 ? -1 : 1) * (i + 1),
            }))
            .forEach(({x, y}) => this.killAt(x, y))
        
        if (to.y === 0 || to.y === 7) pawn.promote()
    }

    killAt = (x, y) => {
        const pawnToRemove = this.#pawns.find(
            (pawn) => pawn.tile.x === x && pawn.tile.y === y
        )

        if (!pawnToRemove) return

        this.#board[y][x] = 0

        this.#pawns = this.#pawns.filter((pawn) => pawn !== pawnToRemove)

        new TWEEN.Tween(pawnToRemove.position)
            .to(
                {
                    y: -20,
                },
                300
            )
            .easing(TWEEN.Easing.Cubic.Out)
            .onComplete(() => this.scene.remove(pawnToRemove))
            .start()
    }

    getAvailablePositions = (pawnPosition) => {
        if (!pawnPosition) return []

        const {x, y} = pawnPosition

        const availablePositions = this.#isWhite
            ? [
                  [
                      {x: x + 1, y: y + 1},
                      {x: x + 2, y: y + 2},
                  ],
                  [
                      {x: x - 1, y: y + 1},
                      {x: x - 2, y: y + 2},
                  ],
              ]
            : [
                  [
                      {x: x - 1, y: y - 1},
                      {x: x - 2, y: y - 2},
                  ],
                  [
                      {x: x + 1, y: y - 1},
                      {x: x + 2, y: y - 2},
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

    #selected = null
    onclick = (event) => {
        this.raycaster.setFromCamera(
            new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            ),
            this.camera
        )

        const intersectsPawns = this.raycaster.intersectObjects(
            this.#isWhiteTurn === this.#isWhite
                ? this.#pawns.filter((pawn) => pawn.isWhite === this.#isWhite)
                : []
        )

        if (intersectsPawns.length > 0) {
            const pawn = intersectsPawns[0].object.tile
            this.#selected = pawn

            this.resetColors()

            this.#pawns
                .find(
                    (pawn) =>
                        pawn.tile.x === this.#selected.x &&
                        pawn.tile.y === this.#selected.y
                )
                ?.highlight(true)

            this.getAvailablePositions(this.#selected)
                .map(({x, y}) =>
                    this.#tiles.find(
                        (tile) => tile.tile.x === x && tile.tile.y === y
                    )
                )
                .forEach((tile) => tile.highlight(true))
        }

        const intersectsTiles = this.raycaster.intersectObjects(
            this.getAvailablePositions(this.#selected).map(({x, y}) =>
                this.#tiles.find(
                    (tile) => tile.tile.x === x && tile.tile.y === y
                )
            )
        )
        if (intersectsTiles.length > 0) {
            const tile = intersectsTiles[0].object.tile

            this.resetColors()

            this.moveFromTo(this.#selected, tile)
            this.#onMove?.(this.#selected, tile)
            this.switchTurn(!this.#isWhiteTurn)
        }
    }
}

export default Game
