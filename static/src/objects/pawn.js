class Pawn extends THREE.Mesh {
    #texture = undefined

    constructor(pos, size, tile, isWhite, mats) {
        const texture = [
            new THREE.MeshBasicMaterial({
                color: isWhite ? 0x777a7f : 0xde9d35,
            }),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                map: isWhite ? mats['pawn-white-top'] : mats['pawn-black-top'],
            }),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                map: isWhite
                    ? mats['pawn-white-bottom']
                    : mats['pawn-black-bottom'],
            }),
        ]

        super(new THREE.CylinderGeometry(size / 2, size / 2, 10, 32), texture)
        this.position.set(pos.x, pos.y + 5, pos.z)

        this.#texture = texture

        this.tile = tile
        this.isWhite = isWhite
        this.isQueen = false
    }

    highlight = (isHighlighted) => {
        if (isHighlighted)
            this.material = new THREE.MeshBasicMaterial({
                color: 0xdd0000,
            })
        else this.material = this.#texture
    }

    promote = () => {
        this.isQueen = true

        setTimeout(() => {
            new TWEEN.Tween(this.position)
                .to(
                    {
                        y: this.position.y + 100,
                    },
                    1200
                )
                .easing(TWEEN.Easing.Cubic.InOut)
                .repeat(1)
                .yoyo(true)
                .start()

            setTimeout(() => {
                new TWEEN.Tween(this.rotation)
                    .to(
                        {
                            x: Math.PI,
                        },
                        300
                    )
                    .easing(TWEEN.Easing.Linear.None)
                    .repeat(4)
                    .start()
            }, 300)
        }, 500)
    }
}

export default Pawn
