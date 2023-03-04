class Tile extends THREE.Mesh {
    #isHighlighted = false

    constructor(pos, size, tile, isWhite) {
        super(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({
                color: isWhite ? 0xdddddd : 0x333333,

                side: THREE.DoubleSide,
            })
        )
        this.position.set(pos.x, pos.y, pos.z)

        this.tile = tile
        this.isWhite = isWhite
    }

    highlight = (isHighlighted) => {
        if (isHighlighted) this.material.color.set(0x00ff00)
        else this.material.color.set(this.isWhite ? 0xdddddd : 0x333333)

        this.#isHighlighted = isHighlighted
    }
}

export default Tile
