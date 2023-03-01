class Pawn extends THREE.Mesh {
    constructor(pos, size, color, tile, isWhite) {
        super(
            new THREE.CylinderGeometry(size.x / 2, size.x / 2, size.y, 32),
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

export default Pawn
