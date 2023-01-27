class UI {
    constructor() {
        this.container = document.querySelector('#ui')
    }

    login = async () => {
        this.container.innerHTML = `
            <div id="login">
                <input id="username" type="text" placeholder="Username" />
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
}

export default UI
