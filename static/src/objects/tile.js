class Tile extends THREE.Mesh {
    #texture = undefined

    constructor(pos, size, tile, isWhite, mats) {
        const texture = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: isWhite ? mats['tile-white'] : mats['tile-black'],
            side: THREE.DoubleSide,
        })

        super(new THREE.BoxGeometry(size, 10, size), texture)
        this.position.set(pos.x, pos.y - 5, pos.z)

        this.#texture = texture

        this.tile = tile
        this.isWhite = isWhite
    }

    highlight = (isHighlighted) => {
        if (isHighlighted)
            this.material = new THREE.MeshBasicMaterial({
                color: 0x00dd00,
            })
        else this.material = this.#texture
    }
}

export default Tile
