class Tag {
    constructor(name, popularity) {
        this.id = id ++
        this.name = name
        this.popularity = popularity
    }
}

// Add a tag to the list of tags if it doesn't exist
// Otherwise, change the popularity of the tag
const add = (name, popularity) => {
    let tag = tags.find(tag => tag.name === name)

    if (tag){
        tag.popularity += popularity
        return 'success'
    }

    tag = new Tag(name, popularity)
    tags.push(tag)
    return 'success'
}

let id = 0
const tags = [
    new Tag('JavaScript', 100),
]

module.exports = {
    Tag,
    tags,
    add,
}
