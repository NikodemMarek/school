interface Sprite {
    src: string
}

interface Frame {
    sprite: Sprite,
    duration: number,
}

class AnimatedSprite implements Sprite {
    src: string = ''

    private current: number = 0
    private toSwitch: number = 0

    constructor(private sprites: Frame[], public loop: boolean = true) {
        this.update(0)
    }

    public update = (delta: number) => {
        this.toSwitch -= delta

        if (this.toSwitch > 0) return

        this.current = this.current === this.sprites.length - 1? 0: this.current + 1

        const frame = this.sprites[this.current]
        
        this.toSwitch += frame.duration
        this.src = frame.sprite.src

        this.update(0)
    }
}

export {Sprite, Frame, AnimatedSprite}
