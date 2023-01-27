class Pawn extends THREE.Mesh {
    constructor(pos, size, color) {
        super(
            new THREE.CylinderGeometry(size.x / 2, size.x / 2, size.y, 32),
            new THREE.MeshBasicMaterial({
                color,
                side: THREE.DoubleSide,
            })
        )
        this.position.set(pos.x, pos.y, pos.z)
    }
}

export default Pawn
