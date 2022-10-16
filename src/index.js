import drawBoard from './draw/drawBoard.js'
import Board from './data/board.js'

document.body.innerHTML = `
  <label for='h'>height: </label>
  <input id='h' name='h' type='text'>

  <br><br>
  <label for='w'>width: </label>
  <input id='w' name='w' type='text'>

  <br><br>
  <label for='m'>mines: </label>
  <input id='m' name='m' type='text'>

  <br><br>
  <button id='gen'>generuj</button>

  <h2 id='m-left'>mines left: 0</h2>
  <h2 id='timer'>grasz: 0[s]</h2>

  <br><br>
  <div class='board' style='margin-bottom: 10px;'></div>`

const GameState = Object.freeze({
    INIT: 0,
    GAME: 1,
    END: 2
})

const spaceAroundStart = {
    x: 1,
    y: 1
}

const onCoveredClick = (position) => {
        if(gameState === GameState.GAME && board.isOnBoard(position) && board.additionalElementData[position.x * board.board.size.y + position.y].mark === 0) {
            if(board.isValue(position, 0)) {
                board.setValue(position, 12);

                [
                    { x: position.x - 1, y: position.y - 1 },
                    { x: position.x - 1, y: position.y },
                    { x: position.x - 1, y: position.y + 1 },
                    { x: position.x, y: position.y - 1 },
                    { x: position.x, y: position.y + 1 },
                    { x: position.x + 1, y: position.y - 1 },
                    { x: position.x + 1, y: position.y },
                    { x: position.x + 1, y: position.y + 1 }
                ].forEach(pos => onCoveredClick(pos))
            } else if(board.someValue(position, 1, 2, 3, 4, 5, 6, 7, 8, 9)) {
                board.setValue(position, board.valueAt(position) + 12)
                drawBoard(board)
            }
        }

        if (gameState === GameState.GAME && isVictory())
            onVictory()
    }

const boardContainer = document.getElementsByClassName('board')[0]
const numberColors = [ 'blue', 'green', 'red', 'purple', 'brown', 'cyan', 'black', 'gray' ]
const elementProperties = [
    {
        class: 'covered',
        render: (add) => `<img src='../assets/img/${add.mark === 1? 'flaga': add.mark === 2? 'pyt': 'klepa'}.png' style='width: 100%; height: 100%;'>`,
        eventListeners: [
            {
                event: 'click',
                perform: (element, event, elementData) => {
                    if(gameState === GameState.GAME) {
                        onCoveredClick(elementData.elementPosition)
                    } else if(gameState === GameState.INIT) {
                        gameState = GameState.GAME

                        placeBombs(bombs, board,
                            {
                                from: {
                                    x: elementData.elementPosition.x - spaceAroundStart.x,
                                    y: elementData.elementPosition.y - spaceAroundStart.y
                                },
                                to: {
                                    x: elementData.elementPosition.x + spaceAroundStart.x,
                                    y: elementData.elementPosition.y + spaceAroundStart.y
                                }
                            }
                        )

                        board.applyFor(position => {
                            const bombsAround = [
                                { x: position.x - 1, y: position.y - 1 },
                                { x: position.x - 1, y: position.y },
                                { x: position.x - 1, y: position.y + 1 },
                                { x: position.x, y: position.y - 1 },
                                { x: position.x, y: position.y + 1 },
                                { x: position.x + 1, y: position.y - 1 },
                                { x: position.x + 1, y: position.y },
                                { x: position.x + 1, y: position.y + 1 }
                            ].reduce((bombs, position) => board.isValue(position, 10)? bombs + 1: bombs, 0)
                    
                            board.setValue(position, bombsAround === 0? 0: bombsAround)
                        }, 0)

                        onCoveredClick(elementData.elementPosition)
                        drawBoard(board)
      
                        clearInterval(timer)
                        timer = null
                        startTime = Date.now()

                        if (timer === null)
                          timer = setInterval(() =>
                            document.getElementById('timer').textContent = `grasz: ${Math.ceil((Date.now() - startTime) / 1000)}[s]`, 500)
                    }
                },
            },
            {
              event: 'contextmenu',
              perform: (element, event, elementData) => {
                  if (gameState === GameState.GAME)
                      mark(elementData.elementPosition)
                  else if (gameState === GameState.INIT)
                    alert('click to start first!')
              },
            },
        ],
        additionalData: {
          mark: 0,
        }
    },
  ... Array(9).fill({
      class: 'covered',
      render: (add) => `<img src='../assets/img/${add.mark === 1? 'flaga': add.mark === 2? 'pyt': 'klepa'}.png' style='width: 100%; height: 100%;'>`,
      eventListeners: [
          {
              event: 'click',
              perform: (element, event, elementData) => onCoveredClick(elementData.elementPosition)
          },
          {
            event: 'contextmenu',
            perform: (element, event, elementData) => mark(elementData.elementPosition)
          },
      ],
  }),
  {
      class: 'covered',
      render: (add) => `<img src='../assets/img/${add.mark === 1? 'flaga': add.mark === 2? 'pyt': 'klepa'}.png' style='width: 100%; height: 100%;'>`,
      eventListeners: [
          {
              event: 'click',
              perform: (element, event, elementData) => {
                if (board.additionalElementData[elementData.elementPosition.x * board.board.size.y + elementData.elementPosition.y].mark === 0)
                  gameOver(elementData.elementPosition, board)
              },
          },
          {
            event: 'contextmenu',
            perform: (element, event, elementData) => mark(elementData.elementPosition),
          },
      ],
  },
  {
      class: 'bombExploded',
      render: () => `<img src='../assets/img/bomb.png' style='width: 100%; height: 100%;'>`
  },
  {
      class: 'uncovered'
  },
  ... Array(9).fill(null).map((_, i) => {
    return {
        class: 'uncovered',
        render: () => `<span style='color: ${numberColors[i]};'>${i + 1}</span>`
    }
  }),
  {
      class: 'bombExploded',
      render: () => `<img src='../assets/img/pbomb.png' style='width: 100%; height: 100%;'>`
  },
].reduce((obj, cur, i) => {
  obj[i] = cur
  return obj
}, { })

const spacing = {
    x: 1,
    y: 1
}

let startTime = 0
let timer = null

let bombs = 30
let bombsLeft = bombs

let board = null
let gameState = GameState.INIT

function placeBombs(bombsQuantity, board, ... exclude) { for(let i = 0; i < bombsQuantity; i++) placeBomb(board, ... exclude) }
function placeBomb(board, ... exclude) {
  while(true) {
    const position = {
      x: Math.floor(Math.random() * board.board.size.x),
      y: Math.floor(Math.random() * board.board.size.y),
    }

    if(isNotInExcluded(position, ... exclude) && board.isValue(position, 0)) return board.setValue(position, 10)
  }
}
function isNotInExcluded(position, ... exclude) { return exclude.every(range => position.x < range.from.x || position.y < range.from.y || position.x > range.to.x || position.y > range.to.y) }

function gameOver(position, board) {
  if (gameState === GameState.GAME) {
    gameState = GameState.END

    clearInterval(timer)
    timer = null

    board.setAll(22, 10)
    board.setValue(position, 11)
    drawBoard(board)

    setTimeout(() => alert('you lost!'), 50);
  }
}
function onVictory() {
    gameState = GameState.END

    clearInterval(timer)
    timer = null

    board.setAll(22, 10)
    drawBoard(board)

    setTimeout(() => {
      const nick = prompt('you won!\nenter your name:', 'noname')
      updateScores(nick)
      
      showScores()

      clearInterval(timer)
      timer = null
    }, 50);
}

function isVictory() {
    if (gameState === GameState.GAME) {
        return !board.board.boardData.some((row, x) =>
            row.some((i, y) => board.someValue(
              { x: x, y: y },
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9
            )
        ))
    }
}

function mark(position) {
    if (gameState === GameState.GAME) {
      const add = board.additionalElementData[position.x * board.board.size.y + position.y]
      add.mark = add.mark === 2? 0: add.mark + 1

      if (add.mark === 1)
        bombsLeft --
      else if (add.mark === 2)
        bombsLeft ++
      
      document.getElementById('m-left').textContent = `mines left: ${bombsLeft >= 0? bombsLeft: 0}`
      drawBoard(board)
    }
}

function start() {
  const h = parseInt(hInput.value)
  const w = parseInt(wInput.value)
  const m = parseInt(mInput.value)

  if (h * w < 9) alert('board too small!')
  else if (m < 1) alert('there must be at least 1 mine!')
  else if (h * w - (spaceAroundStart.x * 2 + 1) * (spaceAroundStart.y * 2 + 1) < m) alert('too many mines!')
  else {
    const boardContainerSize = {
        x: 50 * h,
        y: 50 * w
    }
    const boardSize = {
        x: h,
        y: w
    }

    board = new Board(
        boardContainer,
        boardContainerSize,
        boardSize,
        elementProperties,
        {
            spacing: spacing,
            boardColor: 'black'
        }
    )

    bombs = m
    bombsLeft = m

    gameState = GameState.INIT

    document.getElementById('m-left').textContent = `mines left: ${bombsLeft}`
    drawBoard(board)
  }
}

const hInput = document.getElementById('h')
const wInput = document.getElementById('w')
const mInput = document.getElementById('m')

showScores()

const rep = setInterval(() => {
  if(!hInput.value.match(/^[0-9]*[1-9]{1}[0-9]*$/)) hInput.value = ''
  if(!wInput.value.match(/^[0-9]*[1-9]{1}[0-9]*$/)) wInput.value = ''
  if(!mInput.value.match(/^[0-9]*[1-9]{1}[0-9]*$/)) mInput.value = ''

  showScores()
}, 1000)

document.getElementById('gen').addEventListener('click', () => {
  if (
    hInput.value.match(/^[0-9]*[1-9]{1}[0-9]*$/)
    && wInput.value.match(/^[0-9]*[1-9]{1}[0-9]*$/)
    && mInput.value.match(/^[0-9]*[1-9]{1}[0-9]*$/)
  ) {
    clearInterval(rep)
    start()
  } else {
    alert('invalid input!')
  }
})
const a = getScores()
console.log(a);

function updateScores(nick) {
  const h = parseInt(hInput.value)
  const w = parseInt(wInput.value)
  const m = parseInt(mInput.value)

  const d = new Date()
  d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000))

  const scores = getScores()
  scores.push({ name: nick, time: Math.ceil((Date.now() - startTime) / 1000) })
  scores.sort((a, b) => a.time - b.time)
  
  if (scores.length > 10)
    scores.pop()

  document.cookie = `scores/${h}-${w}-${m}=${JSON.stringify(scores)};expires=${d.toUTCString()};path=/`
}
function getScores() {
  const h = parseInt(hInput.value)
  const w = parseInt(wInput.value)
  const m = parseInt(mInput.value)

  let ca = decodeURIComponent(document.cookie).split(';')
  for(let i = 0; i < ca.length; i ++) {
    let c = ca[i]
    while (c.charAt(0) == ' ')
      c = c.substring(1)

    if (c.indexOf(`scores/${h}-${w}-${m}=`) == 0)
      return JSON.parse(c.substring(`scores/${h}-${w}-${m}=`.length, c.length))
  }

  return []
}
function showScores() {
  let scoreTable = document.querySelector('#score-table')

  if (!scoreTable) {
    scoreTable = document.createElement('table')
    scoreTable.id = 'score-table'
    document.body.appendChild(scoreTable)
  }
  
  scoreTable.style.border = '1px solid black'

  scoreTable.innerHTML =
    `<tr><td></td><td>nick</td><td>time</td></tr>` + 
    getScores()
      .map((score, i) =>
        `<tr><td>${i + 1}. </td><td>${score.name || 'noname'}</td><td>${score.time}[s]</td></tr>`)
      .join('')
}