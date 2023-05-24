const fs = require('fs').promises
const path_utils = require('path')

const root = path_utils.join(__dirname, '..')

const move = async (oldPath, newPath) => {
    await fs.mkdir(path_utils.dirname(newPath), {recursive: true})
    await fs.rename(oldPath, newPath)
}
const remove = async (path) => {
    await fs.rm(path, { recursive: true, force: true })
}

module.exports = {path_utils, root, move, remove}
