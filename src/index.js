const canvas = document.getElementById("cnvs");

const gameState = {};

function onMouseMove(e) {
    gameState.pointer.x = e.pageX;
    gameState.pointer.y = e.pageY
}

function queueUpdates(numTicks) {
    for (let i = 0; i < numTicks; i++) {
        gameState.lastTick = gameState.lastTick + gameState.tickLength;
        update(gameState.lastTick);
    }
}

function draw(tFrame) {
    const context = canvas.getContext('2d');

    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

	drawScore(context)
    drawPlatform(context)
    drawBall(context)

}

function update(tick) {

    const vx = (gameState.pointer.x - gameState.player.x) / 10
    gameState.player.x += vx

    const ball = gameState.ball
    ball.y += ball.vy
    ball.x += ball.vx
	
	checkBounds()
    checkBoard()    

    if(Math.trunc(gameState.lastTick / 1000) > gameState.time)
    {
        gameState.score += 1;
        gameState.time += 1;
    }
    
	
	if (gameState.ball.y + gameState.ball.radius > canvas.height)
		stopGame(gameState.stopCycle)
}

function run(tFrame) {
    gameState.stopCycle = window.requestAnimationFrame(run);

    const nextTick = gameState.lastTick + gameState.tickLength;
    let numTicks = 0;

    if (tFrame > nextTick) {
        const timeSinceTick = tFrame - gameState.lastTick;
        numTicks = Math.floor(timeSinceTick / gameState.tickLength);
    }
    queueUpdates(numTicks);
    draw(tFrame);
    gameState.lastRender = tFrame;
}

function stopGame(handle) {
    window.cancelAnimationFrame(handle);
}

function drawPlatform(context) {
    const {x, y, width, height} = gameState.player;
    context.beginPath();
    context.rect(x - width / 2, y - height / 2, width, height);
    context.fillStyle = "#00FF00";
    context.fill();
    context.closePath();
}

function drawBall(context) {
    const {x, y, radius} = gameState.ball;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = "#0000FF";
    context.fill();
    context.closePath();
}

function drawScore(context){
	context.font = "30px Georgia";
	context.fillStyle = "#000000";
    context.fillText("score: " + gameState.score, 25, 25);
	//context.fill();
}

function checkBounds(){
	if (gameState.ball.x + gameState.ball.radius / 2 >= canvas.width || gameState.ball.x - gameState.ball.radius / 2 <= 0)
		gameState.ball.vx *= -1;
	if (gameState.ball.y - gameState.ball.radius / 2 <= 0)
		gameState.ball.vy *= -1;
}

function checkBoard(){
	if (gameState.ball.y + gameState.ball.radius / 2 >= gameState.player.y - gameState.player.height / 2 && 
		gameState.ball.x >= gameState.player.x - gameState.player.width / 2 + gameState.ball.radius / 2 &&
		gameState.ball.x <= gameState.player.x + gameState.player.width / 2 - gameState.ball.radius / 2)
		gameState.ball.vy *= -1;
	else if (gameState.ball.y + gameState.ball.radius / 2 >= gameState.player.y - gameState.player.height / 2 &&
		(gameState.ball.x + gameState.ball.radius / 2 == gameState.player.x - gameState.player.width / 2 || 
		gameState.ball.x - gameState.ball.radius / 2 == gameState.player.x + gameState.player.width / 2))
		gameState.ball.vx *= -1;
}



function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.addEventListener('mousemove', onMouseMove, false);

    gameState.lastTick = performance.now();
    gameState.lastRender = gameState.lastTick;
    gameState.tickLength = 15; //ms
    gameState.score = 0;
    gameState.time = 0;

    const platform = {
        width: 400,
        height: 50,
    };

    gameState.player = {
        x: 100,
        y: canvas.height - platform.height / 2,
        width: platform.width,
        height: platform.height
    };
    gameState.pointer = {
        x: 0,
        y: 0,
    };
    gameState.ball = {
        x: canvas.width / 2,
        y: 100,
        radius: 25,
        vx: -10,
        vy: 5
    };
}

setup();
run();
