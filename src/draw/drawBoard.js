export default function draw(board) {
    board.boardContainer.container.innerHTML = ''

    board.boardContainer.container.style.width = board.boardContainer.size.x + 'px'
    board.boardContainer.container.style.height = board.boardContainer.size.y + 'px'

    board.boardContainer.container.style.position = 'relative'

    board.boardContainer.container.style.backgroundColor = board.boardContainer.color

    let elements = 0
    board.board.boardData.forEach((column, x) => {
        column.forEach((element, y) => {
            const newElement = createElement(
                {
                    x: x * board.element.size.x + (x + 1) * board.boardContainer.spacing.x,
                    y: y * board.element.size.y + (y + 1) * board.boardContainer.spacing.y
                },
                board.element,
                board.elementProperties[element],
                {
                    elementPosition: {
                        x: x,
                        y: y
                    },
                    ... board.additionalElementData[elements ++]
                }
            )

            board.boardContainer.container.appendChild(newElement)
        })
    })
}
export function createElement(
    position,
    element,
    elementProperties,
    additionalElementData
) {
    const newElement = document.createElement('div')
    newElement.classList.add(elementProperties.class)

    newElement.style.width = `${element.size.x}px`
    newElement.style.height = `${element.size.y}px`

    newElement.style.position = 'absolute'
    newElement.style.top = `${position.y}px`
    newElement.style.left = `${position.x}px`

    newElement.innerHTML = elementProperties.render
        ? elementProperties.render(additionalElementData)
        : ''

    if('eventListeners' in elementProperties) elementProperties.eventListeners.forEach(eventListener =>
        newElement.addEventListener(eventListener.event, event => {
            event.preventDefault()
            eventListener.perform(newElement, event, additionalElementData)
            return false
        }, false))

  return newElement
}