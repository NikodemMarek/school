const MARK_MAX_AGE = 100

class Render {
    constructor(canvas, size) {
        this.size = size

        this.canvas = canvas

        this.canvas.width = this.size.x
        this.canvas.height = this.size.y
        this.canvas.style.width = `${this.size.x}px`
        this.canvas.style.height = `${this.size.y}px`

        this.ctx = this.canvas.getContext('2d')

        this.bgPattern = this.ctx.createPattern(
            document.querySelector('#background'),
            'repeat'
        )

        // Create a track path.
        const track = new Path2D()

        const [sizeX, sizeY] = [this.size.x, this.size.y]
        const [trackWidth] = [sizeY / 5]
        const [bordersX, bordersY] = [sizeX / 10, sizeY / 10]
        const [centerX, centerY] = [sizeX / 2, sizeY / 2]
        const [radius] = [sizeY / 2 - bordersY]
        const [centerCurve0X, centerCurve0Y, radius0] = [
            bordersX + radius,
            centerY,
            radius,
        ]
        const [centerInnerCurve0X, centerInnerCurve0Y, radiusInner0] = [
            centerCurve0X,
            centerCurve0Y,
            radius0 - trackWidth,
        ]
        const [centerCurve1X, centerCurve1Y, radius1] = [
            sizeX - bordersX - radius,
            centerY,
            radius,
        ]
        const [centerInnerCurve1X, centerInnerCurve1Y, radiusInner1] = [
            centerCurve1X,
            centerCurve1Y,
            radius1 - trackWidth,
        ]

        track.arc(
            centerCurve0X,
            centerCurve0Y,
            radius0,
            0.5 * Math.PI,
            1.5 * Math.PI
        )
        track.arc(
            centerCurve1X,
            centerCurve1Y,
            radius1,
            1.5 * Math.PI,
            0.5 * Math.PI
        )
        track.arc(
            centerInnerCurve1X,
            centerInnerCurve1Y,
            radiusInner1,
            0.5 * Math.PI,
            1.5 * Math.PI,
            true
        )
        track.arc(
            centerInnerCurve0X,
            centerInnerCurve0Y,
            radiusInner0,
            1.5 * Math.PI,
            0.5 * Math.PI,
            true
        )
        track.lineTo(centerInnerCurve1X, centerInnerCurve1Y + radiusInner1)
        track.lineTo(centerCurve1X, centerCurve1Y + radius1)
        track.lineTo(centerCurve0X, centerCurve0Y + radius0)
        track.closePath()

        this.track = track

        this.marks = []

        // Background.
        // this.ctx.fillStyle = 'green'
        this.ctx.fillStyle = this.bgPattern
        this.ctx.fillRect(0, 0, this.size.x, this.size.y)
    }

    render = (bikes) => {
        // this.ctx.clearRect(0, 0, this.size.x, this.size.y)

        // Borders.
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = 5
        this.ctx.stroke(this.track)

        // Track.
        this.ctx.fillStyle = 'gray'
        this.ctx.fill(this.track)

        this.marks = this.marks.filter((mark) => {
            // Disappear marks.
            // if (++mark.age > MARK_MAX_AGE) return false
            // this.ctx.globalAlpha = 1 - mark.age / MARK_MAX_AGE

            // Leave marks.
            mark.age += 1 / MARK_MAX_AGE
            this.ctx.globalAlpha = mark.age > 9 ? 0.1 : 1 - mark.age / 10

            this.ctx.fillStyle = mark.color
            this.ctx.fillRect(mark.x, mark.y, 2, 2)

            return true
        })

        this.ctx.globalAlpha = 1

        // Bikes.
        bikes.forEach((bike) => {
            this.ctx.fill(this.renderBike(bike))

            if (bike.isDead) return

            this.marks.push({
                x: bike.x,
                y: bike.y,
                color: bike.color,
                age: 0,
            })
        })
    }
    renderBike = (bike) => {
        const [x, y] = [bike.x, bike.y]

        this.ctx.save()
        this.ctx.translate(x, y)
        this.ctx.rotate(bike.angle)
        this.ctx.translate(-x, -y)
        this.ctx.drawImage(bike.img, x - 20, y - 10, 40, 20)
        this.ctx.restore()
    }

    isOnTrack = (bike) =>
        [
            {x: bike.x - 10, y: bike.y - 10},
            {x: bike.x + 10, y: bike.y - 10},
            {x: bike.x - 10, y: bike.y + 10},
            {x: bike.x + 10, y: bike.y + 10},
        ].every((point) => this.ctx.isPointInPath(this.track, point.x, point.y))
}

export default Render
