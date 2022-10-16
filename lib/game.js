export const GameState = {
  INIT: 0,
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3,
}

export default class Game {
  #update
  set update(updateFn) {
    if (typeof updateFn === 'function')
      this.#update = updateFn
    else
      throw new Error(`update function cannot be ${updateFn}`)
  }
  #render
  set render(renderFn) {
    if (typeof renderFn === 'function')
      this.#render = renderFn
    else
      throw new Error(`render function cannot be ${renderFn}`)
  }
  
  #FPS
  set FPS(FPS) {
    if (
      typeof FPS === 'number'
      && isFinite(FPS)
      && FPS >= 0
    )
      this.#FPS = FPS
    else
      throw new Error(`FPS cannot be ${FPS}`)
  }
  
  #actions
  addAction = action => {
    if (typeof action === 'function')
      this.#actions.push(action)
    else
      throw new Error(`action cannot be ${action}`)
  }

  constructor() {
    // Make functions immutable.
    Object.defineProperty(this, 'step', { writable: false })
    Object.defineProperty(this, 'start', { writable: false })
    Object.defineProperty(this, 'stop', { writable: false })
    Object.defineProperty(this, 'pause', { writable: false })
    Object.defineProperty(this, 'unpause', { writable: false })

    this.state = GameState.INIT

    this.#actions = []

    this.objects = {
      static: [],
      dynamic: [],
      interactive: [],
    }
    
    this.update = composeUpdate()
    this.render = composeRender()
    
    this.#FPS = 60

    this.ext = {}
  }

  step = (delta = 0) => {
    console.log(`delta: ${delta}`)

    let act
    while ((act = this.#actions.pop()))
      act(this, delta)

    if (this.#FPS > 0)
      this.#update(this, delta)

    this.#render(this)
  }

  start = () => {
    this.state = GameState.RUNNING

    this.loop = setInterval(() => {
      if (this.state === GameState.RUNNING) {
        const delta = this.#FPS > 0
          ? 1000 / this.#FPS / 1000
          : 0

        this.step(delta)
      }
    }, 1000 / this.#FPS)
  }

  stop = () => {
    this.state = GameState.FINISHED

    clearInterval(this.loop)
  }

  pause = () => this.state = GameState.PAUSED
  unpause = () => this.state = GameState.RUNNING
}

export const composeUpdate = (then = () => {}) => (game, delta) => {
  game.objects.dynamic.forEach(obj =>
    obj.update(delta))

  then(game, delta)
}
export const composeRender = (then = () => {}) => game => {
  then(game)
}