import { composeUpdate } from '../lib/game.js'
import GameObject from '../lib/object.js'
import { init, getRendered } from '../lib/board-game.js'

const gameSize = {
  x: 30,
  y: 30,
}
const elementSize = {
  x: 25,
  y: 25,
}

const { game } = init(
  gameSize,
  {
    tile: {
      size: elementSize,
      style: {
        'background-color': 'white',
        'box-sizing': 'border-box',
        'border': '1px solid black',
      },
    },
    container: document.querySelector('#game'),
    allowNavigation: false,
  },
)
game.ext.fromHead = 0

const head = new GameObject({
  position: {
    x: 10,
    y: 10,
  },
  points: [ elementSize ],
  velocity: { x: 1 },
  style: {
    'background-color': 'red',
    'box-sizing': 'border-box',
    'border': '1px solid black',
    'z-index': '2',
  },
  data: {
    fromHead: 0,
  },
})
const food = [
  new GameObject({
    position: {
      x: 7,
      y: 7,
    },
    points: [ elementSize ],
    style: {
      'background-color': 'yellow',
      'box-sizing': 'border-box',
      'border': '1px solid black',
      'z-index': '1',
    },
  }),
]
game.objects.dynamic.push(head)
game.objects.static.push(... food)

document.addEventListener('keydown', e => {
  game.addAction((g, delta) => {
    const p = g.objects.dynamic.find(o => o?.data?.fromHead === 0 || false)

    switch (e.key) {
      case 'ArrowUp':
        p.velocity.x = 0
        p.velocity.y = -1
        break
      case 'ArrowDown':
        p.velocity.x = 0
        p.velocity.y = 1
        break
      case 'ArrowLeft':
        p.velocity.y = 0
        p.velocity.x = -1
        break
      case 'ArrowRight':
        p.velocity.y = 0
        p.velocity.x = 1
      break
    }
  })
})

game.update = composeUpdate((g, delta) => {
  food.forEach(f => {
    if (f.position.x === head.position.x && f.position.y === head.position.y) {
      const tail = new GameObject({
        position: {
          x: head.position.x - head.velocity.x,
          y: head.position.y - head.velocity.y,
        },
        points: [ elementSize ],
        velocity: head.velocity,
        style: {
          'background-color': 'red',
          'box-sizing': 'border-box',
          'border': '1px solid black',
          'z-index': '2',
        },
        data: {
          fromHead: ++ g.ext.fromHead,
        },
      })
      g.objects.dynamic
        .push(tail)

      f.position.x = Math.floor(Math.random() * gameSize.x)
      f.position.y = Math.floor(Math.random() * gameSize.y)
    }
  })
  
  g.ext.render.objects = getRendered(g)
})
game.FPS = 1

game.start()

setTimeout(() => {
  game.pause()

  console.log(game.state);
}, 60000);