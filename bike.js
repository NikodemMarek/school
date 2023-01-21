class Bike {
    #angle = 0

    get angle() {
        return this.#angle
    }
    set angle(angle) {
        this.#angle = angle % 360
    }

    constructor(x, y, angle, color, img, keymap, loops) {
        this.x = x
        this.y = y
        this.angle = angle
        this.color = color
        this.img = img
        this.keymap = keymap

        this.isDead = false

        this.loopsLeft = loops
    }
}

export default Bike
