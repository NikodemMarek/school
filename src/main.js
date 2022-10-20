import GameObject from '../lib/object.js';
import { init as initGame, getRendered } from '../lib/board-game.js'

const init = () => {
  const { game } = initGame(
    { x: 10, y: 10 },
    {
      container: document.querySelector('#game'),
    }
  )

  const obs = [
    new GameObject({
      position: { x: 6, y: 6 },
      points: [{ x: 100, y: 100 }],
      ext: { style: { 'background-color': 'red' } },
    }),
    new GameObject({
      position: { x: 0.25, y: 4.25 },
      points: [{ x: 125, y: 175 }],
      ext: {
        style: {
          'background-color': 'green',
          'box-sizing': 'border-box',
          'border': '1px solid white',
        },
      },
    }),
  ]
  game.objects.static.push(... obs)

  game.ext.render.objects = getRendered(game)
  game.step()
  game.start()

  setTimeout(() => {
    game.pause()

    console.log(game.state)
  }, 60000)
}

init()