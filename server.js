const fs = require('fs').promises
const path = require('path')

const NodeHttpServer = require('./NodeHttpServer')
const Datastore = require('nedb')

const dbPath = path.join(__dirname, 'threads.db')
db = new Datastore({
    filename: dbPath,
    autoload: true,
})

class Thread {
    #id = null

    constructor(_id, name) {
        this.#id = _id

        db.insert({
            id: this.#id,
            name: name || `thread ${this.#id}`,
            comments: [],
        })
    }

    comments = () =>
        new Promise((resolve, reject) =>
            db.find({}, (err, docs) => {
                if (err) reject(err)
                else resolve(docs)
            })
        )
    comment = (comment, userId) =>
        new Promise((resolve, reject) =>
            db.update(
                {id: this.#id},
                {$push: {comments: {comment, userId, date: Date.now()}}},
                {},
                (err, newDoc) => {
                    if (err) reject(err)
                    else resolve(newDoc)
                }
            )
        )
}

const server = new NodeHttpServer()

server.get('/threads', async (req, res) => {
    const threads = (
        await new Promise((resolve, reject) =>
            db.find({}, (err, docs) => {
                if (err) reject(err)
                else resolve(docs)
            })
        )
    ).map(({_id, name}) => ({id: _id, name}))

    return {
        body: JSON.stringify(threads),
        headers: {
            'Content-Type': 'application/json',
        },
    }
})

server.get('/thread', async (req, res) => {
    const {id} = req.query

    const thread = new Thread(id)

    const comments = await thread.comments()

    return {
        body: JSON.stringify(comments),
        headers: {
            'Content-Type': 'application/json',
        },
    }
})

server.post('/thread', async (req, res) => {
    const {id} = req.query
    const {comment, userId} = req.body

    const thread = new Thread(id)

    const newComment = await thread.comment(comment, userId)

    return {
        body: JSON.stringify(newComment),
        headers: {
            'Content-Type': 'application/json',
        },
    }
})

server.start()
