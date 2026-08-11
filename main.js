const container = document.querySelector('.container')

const blockWidth = 100
const blockHeight = 20

const boardWidth = 780
const boardHeight = 400

const ballDiameter = 20

let timerId
let score = 0

const scoreDisplay = document.querySelector('#score')
const statusDisplay = document.querySelector('#status')


// ---------------- USER ----------------

const userStart = [340, 10]
let currentPosition = [...userStart]


// ---------------- BALL ----------------

const ballStart = [400, 40]
let ballCurrentPosition = [...ballStart]

let xDirection = 2
let yDirection = 2


// ---------------- BLOCK CLASS ----------------

class Block {

    constructor(xAxis, yAxis) {

        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]

        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}


// ---------------- BLOCKS ----------------

const blocks = [

    // Row 1
    new Block(10, 370),
    new Block(120, 370),
    new Block(230, 370),
    new Block(340, 370),
    new Block(450, 370),
    new Block(560, 370),
    new Block(670, 370),

    // Row 2
    new Block(10, 340),
    new Block(120, 340),
    new Block(230, 340),
    new Block(340, 340),
    new Block(450, 340),
    new Block(560, 340),
    new Block(670, 340),

    // Row 3
    new Block(10, 310),
    new Block(120, 310),
    new Block(230, 310),
    new Block(340, 310),
    new Block(450, 310),
    new Block(560, 310),
    new Block(670, 310),

    // Row 4
    new Block(10, 280),
    new Block(120, 280),
    new Block(230, 280),
    new Block(340, 280),
    new Block(450, 280),
    new Block(560, 280),
    new Block(670, 280)
]


// ---------------- ADD BLOCKS ----------------

function addBlock() {

    blocks.forEach(blockData => {

        const block = document.createElement('div')

        block.classList.add('block')

        block.style.left = blockData.bottomLeft[0] + 'px'
        block.style.bottom = blockData.bottomLeft[1] + 'px'

        container.append(block)
    })
}

addBlock()


// ---------------- USER ----------------

const user = document.createElement('div')

user.classList.add('user')

container.appendChild(user)

drawUser()


function drawUser() {

    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}


// ---------------- MOVE USER ----------------

function moveUser(e) {

    switch (e.key) {

        case 'ArrowLeft':

            if (currentPosition[0] > 0) {

                currentPosition[0] -= 10

                drawUser()
            }

            break


        case 'ArrowRight':

            if (currentPosition[0] < boardWidth - blockWidth) {

                currentPosition[0] += 10

                drawUser()
            }

            break
    }
}


document.addEventListener('keydown', moveUser)


// ---------------- BALL ----------------

const ball = document.createElement('div')

ball.classList.add('ball')

container.appendChild(ball)

drawBall()


function drawBall() {

    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}


// ---------------- MOVE BALL ----------------

function moveBall() {

    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection

    drawBall()

    checkForCollisions()

    // requestAnimationFrame gives smoother animation
    timerId = requestAnimationFrame(moveBall)
}


// Start the game
timerId = requestAnimationFrame(moveBall)


// ---------------- COLLISION DETECTION ----------------

function checkForCollisions() {

    // ---------- BLOCK COLLISION ----------

    for (let i = blocks.length - 1; i >= 0; i--) {

        const block = blocks[i]

        const ballLeft = ballCurrentPosition[0]
        const ballRight = ballCurrentPosition[0] + ballDiameter

        const ballBottom = ballCurrentPosition[1]
        const ballTop = ballCurrentPosition[1] + ballDiameter

        const blockLeft = block.bottomLeft[0]
        const blockRight = block.bottomRight[0]

        const blockBottom = block.bottomLeft[1]
        const blockTop = block.topLeft[1]


        if (
            ballRight > blockLeft &&
            ballLeft < blockRight &&
            ballTop > blockBottom &&
            ballBottom < blockTop
        ) {

            const allBlocks = document.querySelectorAll('.block')

            allBlocks[i].remove()

            blocks.splice(i, 1)

            yDirection *= -1

            score++

            scoreDisplay.textContent = score


            // WIN
            if (blocks.length === 0) {

                statusDisplay.textContent = 'You Win! 🎉'

                cancelAnimationFrame(timerId)

                document.removeEventListener('keydown', moveUser)

                return
            }

            break
        }
    }


    // ---------- WALL COLLISION ----------

    if (
        ballCurrentPosition[0] <= 0 ||
        ballCurrentPosition[0] >= boardWidth - ballDiameter
    ) {

        xDirection *= -1
    }


    if (
        ballCurrentPosition[1] >= boardHeight - ballDiameter
    ) {

        yDirection *= -1
    }


    // ---------- USER / PADDLE COLLISION ----------

    if (
        ballCurrentPosition[0] + ballDiameter > currentPosition[0] &&
        ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
        ballCurrentPosition[1] <= currentPosition[1] + blockHeight &&
        ballCurrentPosition[1] + ballDiameter >= currentPosition[1]
    ) {

        yDirection = Math.abs(yDirection)
    }


    // ---------- GAME OVER ----------

    if (ballCurrentPosition[1] <= 0) {

        cancelAnimationFrame(timerId)

        statusDisplay.textContent = 'Game Over 😢'

        document.removeEventListener('keydown', moveUser)
    }
}