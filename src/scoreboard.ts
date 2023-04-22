const KILL_MULTIPLIER = 100

/**
 * Scoreboard class.
 * Handles the scoreboard record keeping.
 * Handles score display and updates.
 */
class Scoreboard {
    /**
     * Current score.
     */
    private _score: number = 0
    /**
     * Highest recorded score.
     */
    private _highscore: number = 0

    /**
     * Container to display the scoreboard in.
     */
    private scoreboard: HTMLDivElement

    /**
     * Creates an instance of Scoreboard.
     * Reads the highscore from localStorage or sets it to 0.
     *
     * @param scoreboard Scoreboard element
     */
    constructor(private refreshFn: (highscore: number, score: number) => void) {
        this._highscore = parseInt(localStorage.getItem('highscore') || '0')

        this.refresh()
    }

    /**
     * Adds points from virus kills to the score.
     * Refreshes the scoreboard.
     *
     * @param value Number of viruses killed
     */
    public addKills = (value: number) => {
        this._score += value * KILL_MULTIPLIER

        this.refresh()
    }

    /**
     * Updates the highscore if the current score is higher.
     * Refreshes the scoreboard.
     */
    public updateHighscore = () => {
        if (this._score <= this._highscore) return

        this._highscore = this._score
        localStorage.setItem('highscore', this._highscore.toString())

        this.refresh()
    }

    /**
     * Refreshes the scoreboard.
     */
    private refresh = () => this.refreshFn(this._highscore, this._score)
}

export default Scoreboard
