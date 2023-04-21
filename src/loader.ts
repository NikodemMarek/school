import map from './assets/spritesheet.json'
import spritesheet from './assets/spritesheet.png'

enum Sprite {
    Num0 = '0.png',
    Num1 = '1.png',
    Num2 = '2.png',
    Num3 = '3.png',
    Num4 = '4.png',
    Num5 = '5.png',
    Num6 = '6.png',
    Num7 = '7.png',
    Num8 = '8.png',
    Num9 = '9.png',
    BlueBigVirusActive = 'bl_bgvirus_active.png'
}

class Loader {
    private loaded: { [file: string]: string }

    constructor() {
        this.loaded = {}
    }

    public loadAll = async () => {
        for(const val of Object.values(Sprite)) {
            await this.loadSprite(val as Sprite)
        }

        console.log(this.loaded)
        console.log(map)
    }

    private loadSprite = async (sprite: Sprite) => new Promise((resolve) => {
        const { x, y, w, h } = map.frames[sprite].frame

        const cvs = document.createElement('canvas')
        cvs.width = w
        cvs.height = h

        const ctx = cvs.getContext('2d')!

        const img = new Image();
        img.src = spritesheet
        img.onload = () => {
            ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

            this.loaded[sprite] = cvs.toDataURL('image/png')
            resolve({})
        }
    })

    public get = (sprite: Sprite) => this.loaded[sprite]
}

export {Sprite}
export default Loader
