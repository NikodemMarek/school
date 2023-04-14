const fs = require('fs').promises
const path_utils = require('path')

const root = path_utils.join(__dirname, '..')

const move = async (oldPath, newPath) => {
    await fs.mkdir(path_utils.dirname(newPath), {recursive: true})
    await fs.rename(oldPath, newPath)
}

module.exports = {path_utils, root, move}
