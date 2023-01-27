class Tile extends THREE.Mesh {
    constructor(pos, size, color) {
        super(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({
                color,
                side: THREE.DoubleSide,
            })
        )
        this.position.set(pos.x, pos.y, pos.z)
    }
}

export default Tile
