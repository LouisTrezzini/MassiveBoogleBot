const request = require('request')
const cheerio = require('cheerio')
const Board = require('./board')
const removeDiacritics = require('./removeDiacritics')

const fs = require('fs')
const words = fs.readFileSync('words.txt').toString().split("\n")
const apiUrl = "http://massiveboggle.fr"

let token = ""
let board
let playerName = ""

request.get({
        url: apiUrl + '/game/play',
        headers: {
            "accept": "*/*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "fr,en-US;q=0.8,en;q=0.6",
            "content-type": "application/x-www-form-urlencoded",
            "Cookie": "_massive_boggle_session=BAh7CSIQX2NzcmZfdG9rZW4iMVBLRHQxN1I5SS8xNmpGWUVpUllpVyt6blVqRnNOM2JBZHBrektjc1Z5WUk9IhBwbGF5ZXJfbmFtZSISVmlzaXRldXJfNDExMiIPc2Vzc2lvbl9pZCIlYTFiYzMyNmQ2Y2YzNWUwZmQ0MGFkY2ZlMzYzNjBmY2QiDnBsYXllcl9pZGkDo8AH--936e7093929508e79f7b4fa9d227e11a5f97d26a",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
        }
    }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // console.log(body)

        let $ = cheerio.load(body)

        token = $('meta[name=csrf_token]').attr('content')
        playerName = $('#player_name').text()

        console.log(playerName)

        getBoard()
    }
})

function getBoard(){
    request.post({
        url: apiUrl + '/game/get_board',
        form: {
            authenticity_token: token
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            boardLetters = body

            console.log("Board: " + boardLetters)

            board = new Board(boardLetters)

            startBot()
        }
    })
}

function sendWord(word) {
    console.log(word)

    request.post({
        url: apiUrl + '/game/guess',
        headers: {
            "accept": "*/*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "fr,en-US;q=0.8,en;q=0.6",
            "content-type": "application/x-www-form-urlencoded",
            "Cookie": "_massive_boggle_session=BAh7CSIQX2NzcmZfdG9rZW4iMVBLRHQxN1I5SS8xNmpGWUVpUllpVyt6blVqRnNOM2JBZHBrektjc1Z5WUk9IhBwbGF5ZXJfbmFtZSISVmlzaXRldXJfNDExMiIPc2Vzc2lvbl9pZCIlYTFiYzMyNmQ2Y2YzNWUwZmQ0MGFkY2ZlMzYzNjBmY2QiDnBsYXllcl9pZGkDo8AH--936e7093929508e79f7b4fa9d227e11a5f97d26a",
            // "Origin": "http://massiveboggle.fr",
            // "Referer": "http://massiveboggle.fr/game/play",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
        },
        form: {
            authenticity_token: token,
            guess: word,
            // utf8: "%E2%9C%93"
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
            console.log("OK")
        }
        else {
            console.log("ERROR")
        }
    })
}

function startBot() {
    for(index in words) {
        const word = words[index]

        if(board.findPath(removeDiacritics(word).toUpperCase()).length > 0) {
            sendWord(words[index])
        }
    }
}
