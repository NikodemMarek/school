class UI {
    constructor() {
        this.container = document.querySelector('#ui')
    }

    login = async () => {
        this.container.innerHTML = `
            <div id="login">
                <input id="username" type="text" placeholder="Username" required />
                <button id="login-btn">Login</button>
            </div>
        `

        const loginButton = document.querySelector('#login-btn')
        const usernameInput = document.querySelector('input')

        return new Promise(
            (resolve) =>
                (loginButton.onclick = () => {
                    document.querySelector('#login').remove()
                    resolve(usernameInput.value)
                })
        )
    }

    loading = (isLoading) =>
        (document.querySelector('#loading').innerHTML = isLoading
            ? '<div id="content"><svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_9y7u{animation:spinner_fUkk 2.4s linear infinite;animation-delay:-2.4s}.spinner_DF2s{animation-delay:-1.6s}.spinner_q27e{animation-delay:-.8s}@keyframes spinner_fUkk{8.33%{x:13px;y:1px}25%{x:13px;y:1px}33.3%{x:13px;y:13px}50%{x:13px;y:13px}58.33%{x:1px;y:13px}75%{x:1px;y:13px}83.33%{x:1px;y:1px}}</style><rect class="spinner_9y7u" x="1" y="1" rx="1" width="10" height="10"/><rect class="spinner_9y7u spinner_DF2s" x="1" y="1" rx="1" width="10" height="10"/><rect class="spinner_9y7u spinner_q27e" x="1" y="1" rx="1" width="10" height="10"/></svg></div>'
            : '')

    gameInfo = (players, isWhite) => {
        this.container.innerHTML = `
            <div id="game-info">
                ${players
                    .map(
                        ({
                            username,
                            isWhite,
                        }) => `<div class="player-info" style="background-color: ${
                            isWhite ? 'white' : 'black'
                        }; color: ${isWhite ? 'black' : 'white'};">
                            <div class="player-info-username">${username}</div>
                        </div>`
                    )
                    .join('')}
            </div>
        `
    }
}

export default UI
