class Game {
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000)
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(0x666666)
        this.renderer.setSize(600, 600)

        document.querySelector('#root').append(this.renderer.domElement)

        this.render()
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
