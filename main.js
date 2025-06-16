const container = document.querySelector('.container')
const blockWidth = 100
const blockHeight = 20
let timerId

const scoreDisplay = document.querySelector('#score')
const statusDisplay = document.querySelector('#status')

const userStart = [340,10]
let currentPosition = userStart // we have to move our user so thats why we are doing this  

const boardWidth = 780
const boardHeight  = 300

const ballDiameter = 20

let xDirection = 2
let yDirection = 2

let score = 0


class Block{
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}





const blocks = [
    new Block(10,370),
    new Block(120,370),
    new Block(230,370),
    new Block(340,370),
    new Block(450,370),
    new Block(560,370),
    new Block(670,370),

    new Block(10,340),
    new Block(120,340),
    new Block(230,340),
    new Block(340,340),
    new Block(450,340),
    new Block(560,340),
    new Block(670,340),

    new Block(10,310),
    new Block(120,310),
    new Block(230,310),
    new Block(340,310),
    new Block(450,310),
    new Block(560,310),
    new Block(670,310),

    
    new Block(10,280),
    new Block(120,280),
    new Block(230,280),
    new Block(340,280),
    new Block(450,280),
    new Block(560,280),
    new Block(670,280),
]






// Adding the blocks
function addBlock(){
    for(let i=0; i<blocks.length; i++)
    {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px'  // iska mtlb ki bottom left ko reference lekr hum apna element create krenge 
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        container.append(block)
    }
}

addBlock()






// Adding the user 
const user = document.createElement('div')
user.classList.add('user')
drawUser()
container.appendChild(user)

// Draw the user
function drawUser(){
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}






// move user left and right direction 
function moveUser(e){
    switch(e.key){
        case'ArrowLeft':
            if(currentPosition[0] > 0){
                currentPosition[0] -= 10 // x li curr pos se -10 kr do or left ki us new value ko assign kro  
                drawUser()
            }
            break;
        
        case'ArrowRight':
            if(currentPosition[0] < boardWidth-100){ // - user width 
                currentPosition[0] += 10
                drawUser()
            }
            break
    }
}






// if we press the keys up dwn lft rght move our user 
document.addEventListener('keydown', moveUser)







// Create a Ball 
const ballStart = [400, 40]
let ballCurrentPosition = ballStart

const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
container.appendChild(ball)

// function to draw tha ball 
function drawBall(){
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}






// move the ball 
function moveBall(){
    // moving ball to both x and y directions 
    ballCurrentPosition[0] += xDirection // 2
    ballCurrentPosition[1] += yDirection // 2
    drawBall()
    checkForCollisions() // jub bhi ball draw kri check for collisions 
}
timerId = setInterval(moveBall, 20) 







// check for collisions and change the directions 
function checkForCollisions(){
    // check for ball collisions 
    for(let i=0; i<blocks.length; i++){
        if(
            // if it is larger then bottom left axis and smaller then bottom right x axis then we know that ball is in the middle of the block
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) && 
            ((ballCurrentPosition[1]+ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) 
        ){
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            // it will remove all the block of particular row so for removing the block that come in the contact of ball we have to use the splice  method 
            blocks.splice(i,1)
            // here splice i, 1 means remove 1 item 
            changeDirection()
            score++
            scoreDisplay.innerHTML = score

            // check for win 
            if(blocks.length === 0)
            {
                statusDisplay.innerHTML = 'You Win.'
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
            }
        }
    }

    // check for ball collisions to walls
    if(
        ballCurrentPosition[0] >= (boardWidth-ballDiameter)|| 
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0
      ){
        changeDirection()
    }

    // check for user collision 
    if(
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
    ){
        changeDirection()
    }

    //check for game over 
    if(ballCurrentPosition[1] <= 0) // mtlb ball niche ghus jaaye 
    {
        clearInterval(timerId)
        statusDisplay.innerHTML = 'You lose...' 
        document.removeEventListener('keydown', moveUser)       
    }

}







function changeDirection(){
    if(xDirection === 2  &&  yDirection === 2){
        yDirection = -2
        return 
    }
    if(xDirection === 2 && yDirection === -2){
        xDirection = -2
        return 
    }
    if(xDirection === -2 && yDirection === -2){
        yDirection = 2
        return 
    }
    if(xDirection === -2 && yDirection === 2){
        xDirection = 2
        return 
    }
} 

