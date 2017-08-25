winScreen(480, 320, false, '2D Breakout');

var w = getScreenWidth();
var h = getScreenHeight();
var centerX = w / 2;
var centerY = h - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var x = centerX;
var y = centerY; 
var color = COLOR.WHITE;
var PAUSE = false;
var LIVES = 3;

//paddle vars
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (w-paddleWidth)/2;

//bricks vars
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for(var c = 0; c < brickColumnCount; c++) {
    bricks[c]=[];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y:0, status: 1, c: getRandomColor()};
    }
}

function collisionDetection() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
}

function drawBricks() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status === 1) {
                var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
                var color = bricks[c][r].c; 
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                fillRect(brickX, brickY, brickWidth, brickHeight, color);
            }
        }
    }
}

function draw() {
    var key = getKey();
    if (key == 'P') {PAUSE = true;} else if (key === 'C') {PAUSE = false;}
    if (PAUSE) {
        setFont(25, 'Helvetica'); 
        drawText('Game paused!', w/3, h/2);
    } else {
        clear();
        fillCircle(x, y, ballRadius, color);
    
        if(key === 'K_RIGHT' && paddleX < (w-paddleWidth)) {
            paddleX += 7;
        }
        else if(key === 'K_LEFT' && paddleX > 0) {
            paddleX -= 7;
        }
    

        if (x+ dx > w-ballRadius || x +dx < ballRadius) {
            dx = -dx;
            //color = getRandomColor();
        }
    
      /*if (y+dy > h-ballRadius || y + dy < ballRadius) {
           dy = -dy;
         //color = getRandomColor();
        }*/

        if(y + dy < ballRadius) {
            dy = -dy;
        }
        else if(y+dy > h-ballRadius) {
            if(x>paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else if (LIVES <= 0) {
                setFont(25, 'Helvetica'); 
                drawText('Game OVER', w/3, h/2);
                stop();
            } else {
                LIVES--;
            }
        }
    
        x += dx;
        y += dy;
        drawPaddle();
        drawBricks();
        collisionDetection();
    }
}

function drawPaddle() {
    fillRect(paddleX, h-paddleHeight, paddleWidth, paddleHeight, color);
}

function main() {
    draw();
 }