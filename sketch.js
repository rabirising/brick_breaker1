let ball;
let paddle;
let bricks = [];
let cols = 8;
let rows = 5;
let gameStarted = false;
let startButton, restartButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ball = new Ball();
  paddle = new Paddle();
  setupBricks();

  // Create Start Button
  startButton = createButton('Start Game');
  startButton.position(width / 2 - 40, height / 2);
  startButton.mousePressed(startGame);
  startButton.style('font-size', '20px');

  // Create Restart Button (Initially Hidden)
  restartButton = createButton('Restart');
  restartButton.position(width / 2 - 30, height / 2 + 50);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
  restartButton.style('font-size', '20px');
}

function draw() {
  background(0);

  if (!gameStarted) {
    textSize(24);
    fill(255);
    textAlign(CENTER);
    text("Tap Start to Play", width / 2, height / 2 - 50);
    return;
  }

  ball.update();
  ball.show();
  ball.checkPaddle(paddle);

  paddle.show();
  paddle.move();

  // Show and check brick collisions
  for (let i = bricks.length - 1; i >= 0; i--) {
    bricks[i].show();
    if (ball.hits(bricks[i])) {
      bricks.splice(i, 1);
      ball.reverse();
    }
  }

  // Check for game over
  if (ball.offScreen()) {
    gameOver();
  }

  // Check for win condition (all bricks cleared)
  if (bricks.length === 0) {
    gameOver(true);
  }
}

function startGame() {
  gameStarted = true;
  startButton.hide();
}

function restartGame() {
  gameStarted = false;
  startButton.show();
  restartButton.hide();
  ball = new Ball();
  paddle = new Paddle();
  setupBricks();
  loop();
}

function gameOver(win = false) {
  noLoop(); // Stop the game
  textSize(32);
  fill(win ? "green" : "red");
  textAlign(CENTER);
  text(win ? "You Win!" : "Game Over!", width / 2, height / 2);
  restartButton.show();
}

function setupBricks() {
  bricks = [];
  let brickWidth = width / cols;
  let brickHeight = 20;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      bricks.push(new Brick(i * brickWidth, j * brickHeight, brickWidth, brickHeight));
    }
  }
}

// Ball Class
class Ball {
  constructor() {
    this.x = width / 2;
    this.y = height - 30;
    this.r = 10;
    this.xSpeed = 3;
    this.ySpeed = -3;
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x < 0 || this.x > width) {
      this.xSpeed *= -1; // Bounce off left/right walls
    }
    
    if (this.y < 0) {
      this.ySpeed *= -1; // Bounce off top wall
    }
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }

  checkPaddle(paddle) {
    if (this.y + this.r >= paddle.y &&
        this.x > paddle.x && this.x < paddle.x + paddle.w) {
      this.ySpeed *= -1; // Bounce off the paddle
    }
  }

  hits(brick) {
    return (this.x > brick.x && this.x < brick.x + brick.w &&
            this.y > brick.y && this.y < brick.y + brick.h);
  }

  reverse() {
    this.ySpeed *= -1;
  }

  offScreen() {
    return this.y > height;
  }
}

// Paddle Class
class Paddle {
  constructor() {
    this.w = width / 4; // Adjust width for mobile
    this.h = 10;
    this.x = width / 2 - this.w / 2;
    this.y = height - 40;
    this.speed = 6;
  }

  move() {
    // Paddle moves based on touch
    if (touches.length > 0) {
      this.x = touches[0].x - this.w / 2;
    }
    this.x = constrain(this.x, 0, width - this.w);
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }
}

// Brick Class
class Brick {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  show() {
    fill(200, 0, 200);
    rect(this.x, this.y, this.w, this.h);
  }
}

function touchMoved() {
  paddle.x = constrain(mouseX - paddle.w / 2, 0, width - paddle.w);
  return false; // Prevent scrolling
}
