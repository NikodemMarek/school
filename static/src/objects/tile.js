class Tile extends THREE.Mesh {
    constructor(pos, size, color, tile, isWhite) {
        super(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({
                color,
                side: THREE.DoubleSide,
            })
        )
        this.position.set(pos.x, pos.y, pos.z)

        this.tile = tile
        this.isWhite = isWhite
    }
}

export default Tile
