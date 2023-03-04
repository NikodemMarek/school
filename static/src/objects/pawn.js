class Pawn extends THREE.Mesh {
    #isHighlighted = false

    constructor(pos, size, tile, isWhite) {
        super(
            new THREE.CylinderGeometry(size.x / 2, size.x / 2, size.y, 32),
            new THREE.MeshBasicMaterial({
                color: isWhite ? 0xffffff : 0x000000,
                side: THREE.DoubleSide,
            })
        )
        this.position.set(pos.x, pos.y, pos.z)

        this.tile = tile
        this.isWhite = isWhite
    }

    highlight = (isHighlighted) => {
        if (isHighlighted) this.material.color.set(0xff0000)
        else this.material.color.set(this.isWhite ? 0xffffff : 0x000000)

        this.#isHighlighted = isHighlighted
    }
}

export default Pawn
