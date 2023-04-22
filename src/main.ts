import {Point} from './objects'
import GameManager from './game-manager'
import Loader from './loader'

const loader = new Loader()
loader.loadAll().then(() => new GameManager(new Point(10, 20), loader))
