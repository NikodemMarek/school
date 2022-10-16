export default class Board {
    boardContainer = undefined
    board = undefined
    
    element = undefined
    elementProperties = undefined
    additionalElementData = undefined

    constructor(
        boardContainer,
        boardContainerSize,
        boardSize,
        elementProperties,
        // Optional.
        {
            boardColor,
            spacing,
            boardData,
            additionalElementData
        }
    ) {
        this.boardContainer = {
            container: boardContainer,
            size: boardContainerSize,
            color: boardColor || 'black',
            spacing: spacing || { x: 0, y: 0 }
        }
        this.board = {
            size: boardSize,
            boardData: boardData || JSON.parse(JSON.stringify(Array(boardSize.x).fill(Array(boardSize.y).fill(0))))
        }

        this.additionalElementData = additionalElementData || {  }

        let elements = 0
        this.board.boardData.forEach(column =>
            column.filter(element => {
                if(elementProperties[element].additionalData != undefined) this.additionalElementData[elements] = elementProperties[element].additionalData
                elements ++
            }))
        
        this.additionalElementData = JSON.parse(JSON.stringify(this.additionalElementData))

        this.element = {
            size: {
                x: (boardContainerSize.x - spacing.x) / boardSize.x - spacing.x,
                y: (boardContainerSize.y - spacing.y) / boardSize.y - spacing.y
            }
        }

        this.elementProperties = elementProperties
    }
}

Board.prototype.isOnBoard = function(position) { return position.x >= 0 && position.x < this.board.size.x && position.y >= 0 && position.y < this.board.size.y }

Board.prototype.applyFor = function(callbackfn, ... values) {
    this.board.boardData.forEach((row, rowIndex) =>
        row.forEach((element, index) => {
            if(values.some(value => value == element)) callbackfn({
                x: rowIndex,
                y: index
            })
        }))
}

Board.prototype.setValue = function(position, value) { if(this.isOnBoard(position)) this.board.boardData[position.x][position.y] = value }
Board.prototype.setAll = function(newValue, ... values) { this.applyFor(position => this.setValue(position, newValue), ... values) }

Board.prototype.valueAt = function(position) { return this.isOnBoard(position)? this.board.boardData[position.x][position.y]: null }
Board.prototype.isValue = function(position, value) { return this.isOnBoard(position) && this.valueAt(position) == value }

Board.prototype.someValue = function(position, ... values) { return values.some(value => this.isValue(position, value)) }