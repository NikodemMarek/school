class User {
    constructor(name, lastName, email, password) {
        this.id = id++
        this.name = name
        this.lastName = lastName
        this.email = email
        this.password = password
        this.confirmed = false
        this.profilePicture = null
    }
}

User.prototype.confirm = function() {
    this.confirmed = true
}

let id = 0

const users = []

module.exports = {
    User,
    users,
}

