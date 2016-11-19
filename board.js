class Board {
    constructor(boardStr){
        this.boardSize = 4
        this.isFilled = true
        this.curPath = []
        this.boardStr = boardStr
    }

    selectWord(word)
    {
        this.curPath = this.findPath(word.toUpperCase())
        this.unselectLetters()
        var board = this
        var isFilled = this.isFilled
    }

    displayLetters(boardStr)
    {
        this.curPath = []
        this.boardIterator(function(cell) {
            cell.innerHTML = boardStr.charAt(cell.i * this.boardSize + cell.j)
        }, boardStr)
    }

    boardIterator(fun) {
       for (var i = 0; i < this.boardSize; i++)
            for (var j = 0; j < this.boardSize; j++) {
                this.boardEl.rows[i].cells[j].i = i
                this.boardEl.rows[i].cells[j].j = j
                fun.apply(this, [this.boardEl.rows[i].cells[j], arguments[1]])
            }
    }

    checkPathNextStep(path, new_coord)
    {
        if (!this.notUsedCoord(path, new_coord))
            return false
        if (path.last() && !this.areAdjacentCoord(path.last(), new_coord))
            return false
        return true
    }

    findPath(word)
    {
        var res = []
        for (var i = 0; i < this.boardSize; i++)
            for (var j = 0; j < this.boardSize; j++)
                if (this.findPathRec(word, [i, j], res))
                    return res
        return res
    }

    findPathRec(word, coord, path)
    {
        var letter = this.boardStr.charAt(coord[0] * this.boardSize + coord[1])
        if (letter != word.charAt(0))
            return false
        path.push(coord)
        if (word.length == 1)
            return true
        var adjs = this.adjacentCoord(coord)
        for (var i = 0; i <adjs.length; i++)
            if (this.notUsedCoord(path, adjs[i]) &&
                this.findPathRec(word.substr(1), adjs[i], path))
                return true
        path.pop()
        return false
    }

    notUsedCoord(path, coord)
    {
        var f = path.find(function(c){
            return c[0] == coord[0] && c[1] == coord[1]
        })
        return f == null
    }

    adjacentCoord(coord)
    {
        var res = []
        if (coord[0] > 0)
            res.push([coord[0] - 1, coord[1]])
        if (coord[0] < (this.boardSize - 1))
            res.push([coord[0] + 1, coord[1]])
        if (coord[1] > 0)
            res.push([coord[0], coord[1] - 1])
        if (coord[1] < (this.boardSize - 1))
            res.push([coord[0], coord[1] + 1])
        if (coord[0] > 0 && coord[1] > 0)
            res.push([coord[0] - 1, coord[1] - 1])
        if (coord[0] < (this.boardSize - 1) && coord[1] < (this.boardSize - 1))
            res.push([coord[0] + 1, coord[1] + 1])
        if (coord[0] < (this.boardSize - 1) && coord[1] > 0)
            res.push([coord[0] + 1, coord[1] - 1])
        if (coord[0] > 0 && coord[1] < (this.boardSize - 1))
            res.push([coord[0] - 1, coord[1] + 1])
        return res
    }

    areAdjacentCoord(coord1, coord2)
    {
        if (Math.abs(coord1[0] - coord2[0]) > 1)
            return false
        if (Math.abs(coord1[1] - coord2[1]) > 1)
            return false
        return true
    }
}

module.exports = Board
