import { composeUpdate, GameState } from '../lib/game.js'
import GameObject from '../lib/object.js'
import { init as initGame, getRendered, isOnBoard } from '../lib/board-game.js'

const init = () => {
  const gameSize = {
    x: 10,
    y: 10,
  }
  const elementSize = {
    x: 25,
    y: 25,
  }

  const { game } = initGame(
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
  game.ext.snakeSpeed = 2
  game.ext.headDirection = 0

  const head = new GameObject({
    position: {
      x: 3,
      y: 3,
    },
    points: [ elementSize ],
    velocity: { x: game.ext.snakeSpeed, y: 0 },
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

  game.objects.body = []
  game.objects.head = [ head ]

  game.objects.food = []
  game.objects.food.push(newFood(game))

  document.addEventListener('keydown', e => {
    const head = game.objects.head[0]

    // game.addAction((g, delta) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'k':
        case 'K':
          if (head.velocity.y === 0)
            game.ext.headDirection = 0
          break
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'j':
        case 'J':
          if (head.velocity.y === 0)
            game.ext.headDirection = 1
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'h':
        case 'H':
          if (head.velocity.x === 0)
            game.ext.headDirection = 2
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'l':
        case 'L':
          if (head.velocity.x === 0)
            game.ext.headDirection = 3
        break
      }
    // })
  })

  game.update = composeUpdate((game) => {
    if (isSnakeBody(game, (game.objects.head[0].position))) {
      game.stop()
      alert("You ate yourself!")
      return
    }
    
    const head = game.objects.head[0]

    head.velocity = [
      { x: 0, y: -game.ext.snakeSpeed },
      { x: 0, y: game.ext.snakeSpeed },
      { x: -game.ext.snakeSpeed, y: 0 },
      { x: game.ext.snakeSpeed, y: 0 }
    ][game.ext.headDirection]

    if (isFood(game, head.position)) {
        const tail = game.objects.body.length <= 0? head: game.objects.body.find(o => o.data.fromHead === game.ext.fromHead)

      if (tail.data.fromHead !== 0)
        tail.style['background-color'] = 'salmon'

      const newTail = new GameObject({
        position: {
          x: tail.position.x,
          y: tail.position.y,
        },
        points: [ elementSize ],
        style: {
          'background-color': 'orange',
          'box-sizing': 'border-box',
          'border': '1px solid black',
          'z-index': '2',
        },
        data: {
          fromHead: ++ game.ext.fromHead,
        },
      })

      game.objects.body
          .push(newTail)

      game.objects.food = game.objects.food
        .filter(f => !isSnakeHead(game, f.position))
      game.objects.food.push(newFood(game))
    }

    const bodyParts = [ ... game.objects.body, ... game.objects.head ]
      .sort((a, b) => b.data.fromHead - a.data.fromHead)
    bodyParts
      .slice(0, bodyParts.length - 1)
      .forEach((o, i) => o.setPosition(
          bodyParts[i + 1].position.x,
          bodyParts[i + 1].position.y
        ))
    
    game.ext.render.objects = getRendered(game)
  }, (game) => {
    if (!isOnBoard(game, game.objects.head[0].position)) {
      game.stop()
      alert('Game Over!')
    }
  })
  game.FPS = game.ext.snakeSpeed

  game.start()

  setTimeout(() => {
    game.pause()

    console.log(game.state);
  }, 60000);
}

const isFood = (game, position) =>
  game.objects.food.some(f =>
    f.position.x === position.x
    && f.position.y === position.y)
const isSnakeHead = (game, position) => {
  const head = game.objects.head[0]

  return (
    head.position.x === position.x
    && head.position.y === position.y
  )
}
const isSnakeBody = (game, position) =>
  game.objects.body.some(part =>
    part.position.x === position.x
    && part.position.y === position.y)

const getNextHeadPosition = game => ({
  x: game.objects.head[0].position.x + Math.sign(game.objects.head[0].velocity.x),
  y: game.objects.head[0].position.y + Math.sign(game.objects.head[0].velocity.y),
})

const newFood = game => {
  let newFoodPosition = {}
  do {
    newFoodPosition.x = Math.floor(Math.random() * game.ext.gameSize.x)
    newFoodPosition.y = Math.floor(Math.random() * game.ext.gameSize.y)
  } while(isFood(game, newFoodPosition) || isSnakeBody(game, newFoodPosition))

  return new GameObject({
    position: newFoodPosition,
    points: [ game.ext.tile.size ],
    style: {
      'background-color': 'yellow',
      'box-sizing': 'border-box',
      'border': '1px solid black',
      'z-index': '1',
    },
  })
}

init()