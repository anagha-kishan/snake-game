const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lime";
const foodColor = "red";
const snakeBorder = "black";
const unitSize = 25; // size of everything in the game
let running = false; // if game is currently running or not
let xVelocity = unitSize; //how far we move on every single game tick. if it is +ve we more right else left
let yVelocity = 0;
//food coodinates
let foodX;
let foodY;
let score = 0;
//snake is an array of objects
let snake = [
  { x: unitSize * 3, y: 0 }, //head
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 }, // top right corner
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
}
function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 100);
  } else {
    displayGameOver();
  }
}
function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function createFood() {
  function randomFood(min, max) {
    let randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameWidth - unitSize);
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function changeDirection(event) {
  const keyPressed = event.key; // Now using strings

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  switch (keyPressed) {
    case "ArrowLeft":
      if (!goingRight) {
        xVelocity = -unitSize;
        yVelocity = 0;
        console.log("Now going left");
      }
      break;
    case "ArrowUp":
      if (!goingDown) {
        xVelocity = 0;
        yVelocity = -unitSize;
        console.log("Now going up");
      }
      break;

    case "ArrowRight":
      if (!goingLeft) {
        xVelocity = unitSize;
        yVelocity = 0;
        console.log("Now going right");
      }
      break;
    case "ArrowDown":
      if (!goingUp) {
        xVelocity = 0;
        yVelocity = unitSize;
        console.log("Now going down");
      }
      break;
    default:
      console.log("Unmatched key:", keyPressed);
  }
}

function moveSnake() {
  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity,
  };
  //   console.log("Moving to", head);
  snake.unshift(head);
  if (
    head.x < 0 ||
    head.x >= gameWidth ||
    head.y < 0 ||
    head.y >= gameHeight ||
    snakeCollision()
  ) {
    running = false;
    return;
  }

  if (snake[0].x === foodX && snake[0].y === foodY) {
    score += 1;
    scoreText.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}

function snakeCollision() {
  const [head, ...body] = snake;
  return body.some((part) => part.x === head.x && part.y === head.y);
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
function checkGameOver() {
  const head = snake[0];

  if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight) {
    running = false;
  }

  // Also check for collision with self
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      running = false;
    }
  }
}
function displayGameOver() {
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!!!", gameWidth / 2, gameHeight / 2);
  running = false;
}
function resetGame() {
    console.log("reset");
    
  xVelocity = unitSize;
  yVelocity = 0;
  score = 0;
  snake = [
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }, // top right corner
  ];
  gameStart();
}
