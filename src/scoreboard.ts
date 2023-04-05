const KILL_MULTIPLIER = 100

class Scoreboard {
    private _score: number = 0
    private _highscore: number = 0

    private scoreboard: HTMLDivElement

    constructor(scoreboard: HTMLDivElement) {
        this.scoreboard = scoreboard

        this._highscore = parseInt(localStorage.getItem('highscore') || '0')

        this.refresh()
    }

    public addKills = (value: number) => {
        this._score += value * KILL_MULTIPLIER

        this.refresh()
    }

    public updateHighscore = () => {
        if (this._score <= this._highscore) return

        this._highscore = this._score
        localStorage.setItem('highscore', this._highscore.toString())

        this.refresh()
    }

    private refresh = () => {
        this.scoreboard.innerHTML = `
            Score: ${this._score}<br>
            Highscore: ${this._highscore}
        `
    }
}

export default Scoreboard
