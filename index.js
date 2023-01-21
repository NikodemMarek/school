import Render from './render.js'
import Bike from './bike.js'

const scoreboard = document.querySelector('#scoreboard')

const updateScoreboard = (bikes) => {
    scoreboard.innerHTML = bikes
        .map(({color, loopsLeft}) => {
            if (loopsLeft < 0) loopsLeft = 0

            return `<div style="color: ${color}; width: 100%;">${loopsLeft}</div>`
        })
        .join('')
}

const init = (bikesOptions, bikeSpeed, angle, loops) => {
    const {render, isOnTrack, size} = new Render(
        document.querySelector('#game'),
        {
            x: window.innerWidth,
            y: window.innerHeight,
        }
    )

    const checkpoints = Array(loops + 1)
        .fill()
        .map((_, i) => ({
            pos: Math.floor(size.x / 2 + 5 * i),
            passed: [],
        }))

    const bikes = bikesOptions.reduce((acc, {img, color, keymap, on}, i) => {
        if (!on) return acc
        return [
            ...acc,
            new Bike(
                size.x / 2,
                size.y - size.y / 5 - size.y / 10 + i * 50 + 20,
                0,
                color,
                img,
                keymap,
                loops + 1
            ),
        ]
    }, [])

    const pressed = new Set()
    document.onkeydown = (e) => pressed.add(e.key)
    document.onkeyup = (e) => pressed.delete(e.key)

    const update = (delta) => {
        bikes.forEach((bike) => {
            if (pressed.has(bike.keymap.LEFT)) bike.angle -= angle
            else if (pressed.has(bike.keymap.RIGHT)) bike.angle += angle

            if (bike.isDead) return

            if (!isOnTrack(bike)) {
                bike.isDead = true

                if (bikes.every((bike) => bike.isDead))
                    alert(`bike ${bike.color} died last!`)

                return
            }

            bike.x += Math.cos(bike.angle) * bikeSpeed * delta
            bike.y += Math.sin(bike.angle) * bikeSpeed * delta

            if (
                bike.y > size.y / 2 &&
                !checkpoints[bike.loopsLeft - 1].passed.includes(bike.color) &&
                checkpoints[bike.loopsLeft - 1].pos - 5 < bike.x &&
                checkpoints[bike.loopsLeft - 1].pos > bike.x
            ) {
                checkpoints[--bike.loopsLeft].passed.push(bike.color)
                updateScoreboard(bikes)
            }

            if (bike.loopsLeft <= 0) {
                bikes.forEach((bike) => (bike.isDead = true))
                alert(`bike ${bike.color} won!`)
            }
        })
    }

    setInterval(() => {
        update(1 / FPS)
        render(bikes)
    }, 1000 / FPS)
}

const FPS = 60

const BIKES_ON = Array(4).fill(false)
BIKES_ON[0] = true

const BIKE_IMGS = Array.from(document.querySelectorAll('.bike-img'))
const BIKE_COLORS = ['red', 'blue', 'orange', 'black']
const BIKE_KEYMAPS = [
    {
        LEFT: 'ArrowLeft',
        RIGHT: 'ArrowRight',
    },
    {
        LEFT: 'a',
        RIGHT: 'd',
    },
    {
        LEFT: 'f',
        RIGHT: 'h',
    },
    {
        LEFT: 'j',
        RIGHT: 'l',
    },
]
const BIKE_SPEED = 100
const BIKE_ANGLE = 0.01
const LOOPS = 5

const startMenu = document.querySelector('#start-menu')
Array.from(startMenu.querySelectorAll('.player')).forEach((div, i) => {
    const [right, left, on] = [
        div.querySelector(`#p${i}-r`),
        div.querySelector(`#p${i}-l`),
        div.querySelector(`#p${i}-on`),
    ]

    left.innerHTML = BIKE_KEYMAPS[i].LEFT
    right.innerHTML = BIKE_KEYMAPS[i].RIGHT

    right.onkeypress = (e) => {
        e.preventDefault()
        BIKE_KEYMAPS[i].RIGHT = e.key
        right.innerHTML = e.key
    }
    left.onkeypress = (e) => {
        e.preventDefault()
        BIKE_KEYMAPS[i].LEFT = e.key
        left.innerHTML = e.key
    }

    on.onclick = () => {
        div.classList.toggle('on')

        BIKES_ON[i] = !BIKES_ON[i]
    }
})

startMenu.querySelector('#start-button').onclick = () => {
    if (BIKES_ON.every((on) => !on)) return

    startMenu.style.display = 'none'

    init(
        Array(4)
            .fill()
            .map((_, i) => ({
                img: BIKE_IMGS[i],
                color: BIKE_COLORS[i],
                keymap: BIKE_KEYMAPS[i],
                on: BIKES_ON[i],
            })),
        BIKE_SPEED,
        BIKE_ANGLE,
        LOOPS
    )
}
