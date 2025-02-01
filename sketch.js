let grid = [];
let cols, rows;
let size = 10;

let video;
let handPose;
let hands = [];
let options = { flipped: true };

function preload() {
  handPose = ml5.handPose(options);
}

function setup() {
  createCanvas(640, 480);

  // Create the webcam video and hide it
  video = createCapture(VIDEO, options);
  video.size(640, 480);
  video.hide();

  //start detecting hands
  handPose.detectStart(video, getHands);

  rows = height / size;
  cols = width / size;

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
  drawRect();

  //draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let indexFinger = hand.keypoints[8];
    addCoins(indexFinger.x, indexFinger.y)
    }
  }
  let nextGrid = [];
  for (let i = 0; i < cols; i++) {
    nextGrid[i] = [];
    for (let j = 0; j < rows; j++) {
      nextGrid[i][j] = 0;
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      if (state > 0) {
        if (j + 1 < rows) {
          let below = grid[i][j + 1];
          let dir;
          if (random() < 0.5) {
            dir = -1;
          } else {
            dir = 1;
          }
          let belowDiag;
          if (i + dir > 0 && i + 1 < cols - 1) {
            belowDiag = grid[i + dir][j + 1];
          }

          if (below == 0) {
            nextGrid[i][j + 1] = state;
          } else if (belowDiag == 0) {
            nextGrid[i + dir][j + 1] = state;
          } else {
            nextGrid[i][j] = state;
          }
        } else {
          nextGrid[i][j] = state;
        }
      }
    }
  }
  grid = nextGrid;
}

//callback function for when handPose outputs data
function getHands(results) {
  // save the output to the hands variable
  hands = results;
}
function drawRect() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] > 0) {

        noStroke();
        fill(255, 223, 0, grid[i][j]);
        ellipse(i * size + size / 2, j * size + size / 2, size, size);
        fill(0);
        rectMode(CENTER);
        rect(i * size + size / 2, j * size + size / 2, size / 3, size / 3);
      }
    }
  }
}
function addCoins(fingerX, fingerY) {
  let x = floor(fingerX / size);
  let y = floor(fingerY / size);
  x = constrain(x, 0, cols - 1);
  y = constrain(y, 0, rows - 1);
  grid[x][y] = (frameCount % 205) + 50;
}

function windowResized() {
  resizeCanvas(400, 400);
}
