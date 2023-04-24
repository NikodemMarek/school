/**
 * Sprite
 *
 * @param src - Path to the sprite
 */
interface Sprite {
    src: string
}

/**
 * Frame
 *
 * @param sprite - Sprite
 * @param duration - Duration of the frame
 */
interface Frame {
    sprite: Sprite
    duration: number
}

/**
 * AnimatedSprite
 *
 * @param sprites - Array of frames
 * @param loop - Loop animation
 * @param loop - Loop animation
 */
class AnimatedSprite implements Sprite {
    src: string = ''

    private current: number = 0
    private toSwitch: number = 0

    constructor(private sprites: Frame[], public loop: boolean = true) {
        this.update(0)
    }

    public update = (delta: number) => {
        if (this.current >= this.sprites.length - 1 && !this.loop) return

        this.toSwitch -= delta

        if (this.toSwitch > 0) return

        this.current =
            this.current >= this.sprites.length - 1 ? 0 : this.current + 1

        const frame = this.sprites[this.current]

        this.toSwitch += frame.duration
        this.src = frame.sprite.src

        this.update(0)
    }
}

export {Sprite, Frame, AnimatedSprite}
