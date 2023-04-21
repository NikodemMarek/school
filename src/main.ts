import {Point} from './objects'
import GameManager from './game-manager'
import Loader, { Sprite } from './loader'

// new GameManager(new Point(10, 20))
const s = new Loader()
s.loadAll().then(() => {
    document.body.style.backgroundImage = `url(${s.get(Sprite.BlueBigVirusActive)})`
})
