import map from './assets/spritesheet.json'
import spritesheet from './assets/spritesheet.png'
import { AnimatedSprite, Sprite } from './sprite'

/**
 * Loader
 * Loads all sprites and animations
 * 
 * @param sprites - Object of sprites
 * @param animatedSprites - Object of animated sprites
 */
class Loader {
    sprites: {[file: string]: Sprite} = {}
    animatedSprites: {[file: string]: AnimatedSprite} = {}

    constructor() {
        this.sprites = {}
    }

    /**
     * Load all sprites and animations
     *
     * @returns Promise
     */
    public loadAll = async () => {
        for (const key of Object.keys(map.frames)) {
            await this.loadSprite(key)
        }

        for (const key of Object.keys(map.animations)) {
            this.animatedSprites[key] = new AnimatedSprite(
                map.animations[key].map((sprite) => ({
                    sprite: this.sprites[sprite],
                    duration: 300,
                })),
                true
            )
        }
    }

    /**
     * Load a sprite
     *
     * @param name - Name of the sprite
     * @returns Promise
     */
    private loadSprite = async (name: string) =>
        new Promise((resolve) => {
            const {x, y, w, h} = map.frames[name].frame

            const cvs = document.createElement('canvas')
            cvs.width = w
            cvs.height = h

            const ctx = cvs.getContext('2d')!

            const img = new Image()
            img.src = spritesheet
            img.onload = () => {
                ctx.drawImage(img, x, y, w, h, 0, 0, w, h)

                this.sprites[name] = {
                    src: cvs.toDataURL('image/png'),
                }

                resolve({})
            }
        })

    /**
     * Returns a sprite or animated sprite
     *
     * @param name - Name of the sprite
     * @returns Sprite or AnimatedSprite
     */
    public get = (name: string) =>
        this.animatedSprites[name] || this.sprites[name]
}

export default Loader
