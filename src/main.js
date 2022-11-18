import { composeUpdate, GameState } from '../lib/game.js'
import GameObject from '../lib/object.js'
import { init as initGame, getRendered, isOnBoard } from '../lib/board-game.js'

const Sprite = {
  ... [ 'up', 'down', 'left', 'right' ]
  .reduce((acc, dir) => ({
    ... acc,
    [dir.toUpperCase()]: [ 'cyan', 'pink', 'red', 'yellow' ]
      .reduce((ac, color) => ({ ... ac, [color.toUpperCase()]: `../assets/img/ghost-${color}-${dir}.png`}), {})
  }), {}),
  HEAD: [ 'closed', 'half', 'open' ]
    .reduce((acc, state) => ({ ... acc, [state.toUpperCase()]: `../assets/img/pacman-${state}.png`}), {}),
  TAIL: [ 'up', 'down', 'left', 'right' ]
    .reduce((acc, dir) => ({ ... acc, [dir.toUpperCase()]: `../assets/img/ghost-cold.png`}), {}),
  FOOD: [ 'peach', 'strawberry' ]
    .reduce((acc, type) => ({ ... acc, [type.toUpperCase()]: `../assets/img/food-${type}.png`}), {}),
}
const randomSprite = cat =>
  `url(${Object.values(cat)[Math.floor(Math.random() * Object.keys(cat).length)]})`

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
          'background-color': 'midnightblue',
        },
      },
      container: document.querySelector('#game'),
      allowNavigation: false,
    },
  )
  game.ext.fromHead = 0
  game.ext.snakeSpeed = 5
  game.ext.headDirection = 1

  const head = new GameObject({
    position: {
      x: 3,
      y: 3,
    },
    points: [ elementSize ],
    style: {
      'background-image': `url(${Sprite.HEAD['HALF']})`,
      'background-size': 'cover',
      'z-index': '2',
    },
    data: {
      fromHead: 0,
      isClosing: true,
      frame: 1,
    },
  })

  game.objects.body = []
  game.objects.head = [ head ]

  game.objects.food = []
  game.objects.food.push(newFood(game))

  document.addEventListener('keyup', e => {
    game.addAction(game => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'k':
        case 'K':
          if (game.ext.headDirection === 1 || game.ext.headDirection === 3)
            game.ext.headDirection = 0
          break
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'j':
        case 'J':
          if (game.ext.headDirection === 1 || game.ext.headDirection === 3)
            game.ext.headDirection = 2
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'h':
        case 'H':
          if (game.ext.headDirection === 0 || game.ext.headDirection === 2)
            game.ext.headDirection = 3
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'l':
        case 'L':
          if (game.ext.headDirection === 0 || game.ext.headDirection === 2)
            game.ext.headDirection = 1
        break
      }
    })
  })

  game.update = composeUpdate((game) => {
    if (isSnakeBody(game, (game.objects.head[0].position))) {
      game.stop()
      alert("You ate yourself!")
      return
    }
    if (!isOnBoard(game, game.objects.head[0].position)) {
      game.stop()
      alert('Game Over!')
      return
    }
    
    const head = game.objects.head[0]

    // Transform HEAD Sprite.
    if (head.data.frame === 0)
      head.data.isClosing = false
    else if (head.data.frame === Object.keys(Sprite.HEAD).length - 1)
      head.data.isClosing = true
    head.data.frame += head.data.isClosing? -1: 1
    head.style['background-image'] = `url(${Object.values(Sprite.HEAD)[head.data.frame]})`
    head.style['transform'] = `rotate(${((game.ext.headDirection + 1) % 2) * 90}deg) scaleX(${game.ext.headDirection === 3 || game.ext.headDirection === 0? -1: 1})`

    // Update body parts position.
    const bodyParts = [ ... game.objects.body, ... game.objects.head ]
      .sort((a, b) => b.data.fromHead - a.data.fromHead)
    
    bodyParts
      .slice(0, bodyParts.length - 1)
      .forEach((o, i) => o.setPosition(
          bodyParts[i + 1].position.x,
          bodyParts[i + 1].position.y
        ))

    // Expand snake.
    if (isFood(game, head.position)) {
      const tail = game.objects.body.length <= 0? head: game.objects.body.find(o => o.data.fromHead === game.ext.fromHead)

      const newTail = new GameObject({
        position: {
          x: tail.position.x,
          y: tail.position.y,
        },
        points: [ elementSize ],
        style: {
          'background-image': randomSprite(Sprite.DOWN),
          'background-size': 'cover',
          'z-index': '2',
        },
        data: {
          fromHead: ++ game.ext.fromHead,
          color: Object.keys(Sprite.UP)[Math.floor(Math.random() * Object.keys(Sprite.UP).length)],
        },
      })

      game.objects.body
        .push(newTail)

      game.objects.food = game.objects.food
        .filter(f => !isSnakeHead(game, f.position))
      game.objects.food
        .push(newFood(game))
    }

    // Update HEAD position.
    head.position = [
      { x: head.position.x, y: head.position.y - 1 },
      { x: head.position.x + 1, y: head.position.y },
      { x: head.position.x, y: head.position.y + 1 },
      { x: head.position.x - 1, y: head.position.y },
    ][game.ext.headDirection]

    const parts =  [
      ... game.objects.head,
      ... game.objects.body,
    ]
    
    if (parts.length > 1) {
      const tailO = parts[parts.length - 1]
      const tail = parts[parts.length - 1].position
      const beforeTail = parts[parts.length - 2].position

      if (tail.y < beforeTail.y)
        tailO.style['background-image'] = `url(${Sprite.TAIL['DOWN']})`
      else if (tail.y > beforeTail.y)
        tailO.style['background-image'] = `url(${Sprite.TAIL['UP']})`
      else if (tail.x < beforeTail.x)
        tailO.style['background-image'] = `url(${Sprite.TAIL['RIGHT']})`
      else if (tail.x > beforeTail.x)
        tailO.style['background-image'] = `url(${Sprite.TAIL['LEFT']})`
      else {
        console.log('damn', tail, beforeTail)
        tailO.style['background-image'] = randomSprite(Sprite.TAIL)
      }

      for (let i = 1; i < parts.length - 1; i ++) {
        const o = parts[i]

        const prev = parts[i - 1].position
        const curr = parts[i].position
        const next = parts[i + 1].position

        if (prev.y < curr.y) {
          if (curr.x === next.x)
            o.style['background-image'] = `url(${Sprite.UP[o.data.color]})`
          else if (curr.x < next.x)
            o.style['background-image'] = `url(${Sprite.UP[o.data.color]})`
          else if (curr.x > next.x)
            o.style['background-image'] = `url(${Sprite.UP[o.data.color]})`
        } else if (prev.y > curr.y) {
          if (curr.x === next.x)
            o.style['background-image'] = `url(${Sprite.DOWN[o.data.color]})`
          else if (curr.x < next.x)
            o.style['background-image'] = `url(${Sprite.DOWN[o.data.color]})`
          else if (curr.x > next.x)
            o.style['background-image'] = `url(${Sprite.DOWN[o.data.color]})`
        } else if (prev.x < curr.x) {
          if (curr.y === next.y)
            o.style['background-image'] = `url(${Sprite.LEFT[o.data.color]})`
          else if (curr.y < next.y)
            o.style['background-image'] = `url(${Sprite.LEFT[o.data.color]})`
          else if (curr.y > next.y)
            o.style['background-image'] = `url(${Sprite.LEFT[o.data.color]})`
        } else if (prev.x > curr.x) {
          if (curr.y === next.y)
            o.style['background-image'] = `url(${Sprite.RIGHT[o.data.color]})`
          else if (curr.y < next.y)
            o.style['background-image'] = `url(${Sprite.RIGHT[o.data.color]})`
          else if (curr.y > next.y)
            o.style['background-image'] = `url(${Sprite.RIGHT[o.data.color]})`
        } else {
          o.style['background-image'] = randomSprite(Sprite.UP[o.data.color])
        }
      }
    }
    game.ext.render.objects = getRendered(game)
  })
  game.FPS = game.ext.snakeSpeed

  game.start()
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

const newFood = game => {
  let newFoodPosition = {}
  do {
    newFoodPosition.x = Math.floor(Math.random() * game.ext.gameSize.x)
    newFoodPosition.y = Math.floor(Math.random() * game.ext.gameSize.y)
  } while(isFood(game, newFoodPosition) || isSnakeBody(game, newFoodPosition) || isSnakeHead(game, newFoodPosition))

  return new GameObject({
    position: newFoodPosition,
    points: [ game.ext.tile.size ],
    style: {
      'background-image': randomSprite(Sprite.FOOD),
      'background-size': 'cover',
      'z-index': '1',
    },
  })
}

init()