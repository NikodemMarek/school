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
game.ext.snakeSpeed = 5

const head = new GameObject({
  position: {
    x: 10,
    y: 10,
  },
  points: [ elementSize ],
  velocity: { x: game.ext.snakeSpeed },
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
    switch (e.key) {
      case 'ArrowUp':
        head.velocity.x = 0
        head.velocity.y = -g.ext.snakeSpeed
        break
      case 'ArrowDown':
        head.velocity.x = 0
        head.velocity.y = g.ext.snakeSpeed
        break
      case 'ArrowLeft':
        head.velocity.y = 0
        head.velocity.x = -g.ext.snakeSpeed
        break
      case 'ArrowRight':
        head.velocity.y = 0
        head.velocity.x = g.ext.snakeSpeed
      break
    }
  })
})

game.update = composeUpdate((g, delta) => {
  console.log(g.objects.dynamic);
  food.forEach(f => {
    if (f.position.x === head.position.x && f.position.y === head.position.y) {
      const lastBody = g.objects.dynamic.find(o => o.data.fromHead === g.ext.fromHead)
      const tail = new GameObject({
        position: {
          x: lastBody.position.x,
          y: lastBody.position.y,
        },
        points: [ elementSize ],
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

  const bodyParts = g.objects.dynamic
    .sort((a, b) => b.data.fromHead - a.data.fromHead)
  bodyParts
    .slice(0, bodyParts.length - 1)
    .forEach((o, i) =>
      o.setPosition(
        bodyParts[i + 1].position.x,
        bodyParts[i + 1].position.y
      ))
  
  g.ext.render.objects = getRendered(g)
})
game.FPS = game.ext.snakeSpeed

game.start()

setTimeout(() => {
  game.pause()

  console.log(game.state);
}, 60000);