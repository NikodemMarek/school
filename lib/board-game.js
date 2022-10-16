import Game, { composeUpdate, composeRender } from './game.js'
import GameObject from './object.js'

export const init = (
  size,
  {
    tile = {
      size: { x: 50, y: 50 },
      style: {
        'background-color': 'black',
        'box-sizing': 'border-box',
        'border': '1px solid white',
      },
    },
    container = undefined,
    containerSize = undefined,
    renderSize = {},
    allowNavigation = true
  } = {}) => {
  const game = new Game()

  // Rendering
  game.ext.render = {
    size: {
      x: renderSize.x || size.x,
      y: renderSize.y || size.y,
    },
    origin: {
      x: 0,
      y: 0,
    }
  }

  game.FPS = 0

  game.render = render

  // Container
  game.container = container || document.createElement('div')

  const cSize = {
    x: (containerSize || { x: game.container.width || game.ext.render.size.x * tile.size.x }).x,
    y: (containerSize || { y: game.container.height || game.ext.render.size.y * tile.size.y }).y,
  }

  game.container.style.position = 'relative'
  game.container.style.overflow = 'hidden'

  game.container.style.width = `${cSize.x}px`
  game.container.style.height = `${cSize.y}px`

  ////////////////////////////////////////////
  game.container.style.backgroundColor = 'gray'

  // Tiles
  game.ext.tile = {
    size: {
      x: cSize.x / game.ext.render.size.x,
      y: cSize.y / game.ext.render.size.y,
    },
    style: tile.style,
  }

  game.objects.static.push(
    ... Array(size.x * size.y)
      .fill({})
      .map((_, i) => new GameObject({
        position: {
          x: Math.floor(i / size.x),
          y: i % size.x,
        },
        points: [ game.ext.tile.size ],
        style: game.ext.tile.style,
      }))
  )

  if (allowNavigation) {
    game.container.setAttribute('draggable', true)
    
    // Move render origin
    document.addEventListener('keydown', event =>
      game.addAction((g, delta) => {
        switch(event.key) {
          case 'ArrowUp':
            g.ext.render.origin.y -= 1
          break;
          case 'ArrowDown':
            g.ext.render.origin.y += 1
          break;
          case 'ArrowLeft':
            g.ext.render.origin.x -= 1
          break;
          case 'ArrowRight':
            g.ext.render.origin.x += 1
          break;
        }

        g.ext.render.objects = getRendered(g)
        g.step()
      }))

    // Hide ghost image on drag.
    game.container.addEventListener('dragstart', event => {
      event.dataTransfer.setDragImage(event.target, window.outerWidth, window.outerHeight)

      game.addAction((g, delta) => {
        g.ext.prevDragPos = {
          x: event.offsetX,
          y: event.offsetY,
        }
      })
    })
    game.container.addEventListener('drag', event => game.addAction((g, delta) => {
      if (event.offsetX !== 0 || event.offsetY !== 0) {
        g.ext.render.origin = {
          x: g.ext.render.origin.x - (event.offsetX - g.ext.prevDragPos.x) / g.ext.tile.size.x,
          y: g.ext.render.origin.y - (event.offsetY - g.ext.prevDragPos.y) / g.ext.tile.size.y,
        }
        g.ext.prevDragPos = {
          x: event.offsetX,
          y: event.offsetY,
        }
        
        g.ext.render.objects = getRendered(g)
        g.step()
      }
    }))
  }

  game.ext.render.objects = getRendered(game)
  return {
    game: game,
    container: container,
  }
}

export const getRendered = game => [
    ... game.objects.static,
    ... game.objects.dynamic,
    ... game.objects.interactive,
  ].filter(obj =>
    obj.position.x * game.ext.tile.size.x + obj.points[0].x / 2 >= (game.ext.render.origin.x - 1) * game.ext.tile.size.x
    && obj.position.x * game.ext.tile.size.x - obj.points[0].x / 2 <= (game.ext.render.origin.x + game.ext.render.size.x) * game.ext.tile.size.x
    && obj.position.y * game.ext.tile.size.y + obj.points[0].y / 2 >= (game.ext.render.origin.y - 1) * game.ext.tile.size.y
    && obj.position.y * game.ext.tile.size.y - obj.points[0].y / 2 <= (game.ext.render.origin.y + game.ext.render.size.y) * game.ext.tile.size.y
  )

export const render = (game) => {
  game.container.innerHTML = ''

  game.ext.render.objects
    .forEach(obj => {
      const element = renderObject(
          {
            x: obj.position.x - game.ext.render.origin.x,
            y: obj.position.y - game.ext.render.origin.y,
          },
          obj.points[0],
          game.ext.tile.size,
          obj.style,
        )

      if (obj.actions.length > 0)
        obj.actions
          .forEach(action =>
            element.addEventListener(action.on, event =>
              game.addAction((g, delta) =>
                  action.action(g, delta, event))))

      game.container
        .appendChild(element)
    })
}

const renderObject = (position, size, globalSize, style) => {
  const element = document.createElement('div')

  element.style.position = 'absolute'
  element.style.left = `${globalSize.x * position.x}px`
  element.style.top = `${globalSize.y * position.y}px`

  element.style.width = `${size.x}px`
  element.style.height = `${size.y}px`

  Object.keys(style)
    .forEach(key => element.style[key] = style[key])

  return element
}