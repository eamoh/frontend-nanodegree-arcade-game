// Create "game" variable that manages global state of game.
var Game = function(global) {
    this.gamePlay = false;
    this.paused = false;
    this.gameOver = false;
    enemyCollide = false;
    artifactCollide = false;
};

// instantiate new Game
game = new Game();

// Allow the user to select the image for the player character before
// starting the game.



// creating xStep for Player left and right movements and yStep for
// Player up and down movements. xStep is calculated as one-fifth of
// canvas width. yStep is set to 83 to reflect the same measurements in
// Engine.js.
var xStep = 101;
var yStep = 83;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // This sets the initial position of the Enemy to a random
    // location on one of the three rows of stone. Ideal y-coordinates for
    // Enemies in stone blocks are set in increments of 83 to mirror Player movements
    // movements and are contained in the possibleY array. Y-coordinates will be
    // limited to these to make it easy to track movements.
    // Multiplied by 83 to be consistent with Engine.render().
    var initialX, initialY, x, y;

    this.initialX = 0;

    // selects a y-coordinate in possibleY by randomly selecting an index in
    // the possibleY array. The code returns a random index (integer) between
    // 0 (starting index) and the last index in the array. possibleY is a
    // global array used to determine random y coordinate for enemy and artifacts
    possibleY = [73, 156, 239];
    this.initialY = possibleY[randomize(0, possibleY.length)];
    this.x = this.initialX;
    this.y = this.initialY;

    // sets the Enemy speed by generating a random number
    // that will eventually be multiplied by dt to cause movement
    var speed;
    this.speed = Math.floor((Math.random() * 50) + 100);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // moves across the screen by only updating x-coordinate. Also checks to
    // see if Enemy has gone beyond the dimensions of canvas and restarts it
    //from the beginning.
    if (this.x < 505) {
      this.x += this.speed * dt;
    } else {
      this.x = -505;
      this.y = possibleY[Math.floor(Math.random() * (possibleY.length - 0)) + 0];
      this.speed = Math.floor((Math.random() * 50) + 100);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';

    // Sets the Player initial location to the start square.
    var initialX, initialY, x, y, speed;
    this.initialX = 200;
    this.initialY = 405;

    // set player's initial location
    this.x = this.initialX;
    this.y = this.initialY;

    // give player 5 lives to start
    this.lives = 2;
    // track player score
    this.score = 0;
};

Player.prototype.update = function(dt) {
    this.dt = dt;
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// receives user input and moves the player according to that input
Player.prototype.handleInput = function(allowedKeys) {
    // Moves the Player while ensuring the player cannot move outside
    // the boundaries of canvas as specified
    switch (allowedKeys) {
        case 'left':
          if (this.x > -1) {
            this.x -= xStep;
          }
          break;
        case 'right':
          if (this.x < 401) {
            this.x += xStep;
          }
          break;
        case 'up':
          if (this.y > -9) {
            this.y -= yStep;
          }
          break;
        case 'down':
          if (this.y < 405) {
            this.y += yStep;
          }
          break;
    }

    // checks collision
    checkCollisions();

    // checks to see if player has reached the water and if so, resets to
    // initial location
    if (this.y === -10) {
        this.reset();
    }
};

Player.prototype.reset = function() {
    // resets to initial location
    this.x = this.initialX;
    this.y = this.initialY;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Place the random artifact (gems, hearts, keys) in a variable called artifact
// Do not use var so it becomes global
var allEnemies = [];
player = new Player();

// create several new Enemies objects (3) and place them in the allEnemies array
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'spacebar',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'pause',        // P
        82: 'restart'       // R
    };

    //selector.handleInput(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
    console.log("Key Code:", [e.keyCode], "Allowed Key:", allowedKeys[e.keyCode]);
    if (e.keyCode in allowedKeys) {
        e.preventDefault();
    }
});

// Checks collision by comparing if x and y-coordinates are the same.
// Function does this by checking that player and enemy / artifact occupy the same block.
// If there's collision with enemy, player returns to starting block and scoring
// is updated. If collision is with artifact, points are accumulated
function checkCollisions() {
    // checks collision with enemy
    for (var i = 0; i < allEnemies.length; i++) {
        if (player.x < (allEnemies[i].x + xStep) &&
          (player.x + xStep) > allEnemies[i].x &&
          player.y < (allEnemies[i].y + yStep) &&
          (player.y + yStep) > allEnemies[i].y) {

              // lose 3pts  and 1 life if player collides with enemy.
              if(player.lives === 1 || player.score <= 3) {
                  game.gameOver = true;
                  player.reset();
                  alert("Game over");
              } else {
                  player.score -= 3;
                  player.lives -= 1;
                  scoreBoard.update();
                  lifeTracker.update();
                  player.reset();
              }
        }
    }

    // checks collision with artifacts
    if(player.x < (artifact.x + xStep) &&
        (player.x + xStep) > artifact.x &&
        player.y < (artifact.y + yStep) &&
        (player.y + yStep) > artifact.y) {
            artifact.hide();
            player.score += artifact.points;
            player.lives += artifact.lives;
            scoreBoard.update();
            lifeTracker.update();
        }
}

// Scoreboard appears on top of screen and shows score

var ScoreBoard = function(x, y) {
    this.x = x;
    this.y = y;
    this.score = "Score: " + 0;
};

ScoreBoard.prototype.update = function() {
    this.score = "Score: " + player.score;
};

ScoreBoard.prototype.render = function() {
    ctx.font = "22px Arial Black";
    ctx.fillStyle = "white";
    ctx.fillText(this.score, this.x - 20, this.y + 125);
    ctx.strokeText(this.score, this.x - 20, this.y + 125);
};

// LifeTracker well as how many lives player has left.
var LifeTracker = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Heart.png';
    this.count = player.lives + " x ";
};

LifeTracker.prototype.update = function() {
    this.count = player.lives + " x ";
};

LifeTracker.prototype.render = function () {
    ctx.font = "22px Arial Black";
    ctx.fillStyle = "white";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillText(this.count, this.x - 20, this.y + 125);
    ctx.strokeText(this.count, this.x - 20, this.y + 125);
};

// instantiate scoreboard and LifeTracker
scoreBoard = new ScoreBoard(50, -30);
lifeTracker = new LifeTracker(400, -30);


/* Create item class for gems to be picked up by player
 * Player will drop item upon collission with Enemy
 * @param {String} name Name of item, corresponds to image in memory
 * @param {number} x    X coordinate of item displayed
 * @param {number} y   Y coordinate of item displayed
 */
 var Item = function(x, y) {
    var i = randArtifactIndex(); // stores random index for use in object
    possibleX = [-2, 99, 200, 301, 402]; // global array of possible x values
    this.sprite = artifacts[i].sprite;
    this.x = x;
    this.y = y; // possibleY[randomize(0, possibleY.length)];
    this.height = 30;
    this.width = 30;
    this.visible = true;
    this.points = artifacts[i].points;
    this.lives = artifacts[i].lives;
    //this.status = "available";
    console.log(i);
 };

 // What to do once player picks up item
 Item.prototype.pickup = function() {
     // Set initial conditions to be in place
     this.visible = false;
     player.carryItem = true;

     /* change player sprite name to show item carried (e.g. char-boy.png becomes
      * char-boy_w_gem)
      */
     player.sprite = player.sprite(0,-4) + '_w_' + this.name + '.png';

     // Hide item off screen (to be reused on reset)
     this.x = -101;
     this.y = -101;
 };

 // Drop item from player possession when player reaches water (top of screen),
 // or collides with Enemy
 // and update entities to match state
 Item.prototype.drop = function() {
    //this.visible = true; // only necesssary if dropping on gameboard and leaving there
    player.carryItem = false;
    this.x = player.x;
    this.y = player.y;
 };

 // Reset will set item in random location to be picked up
 Item.prototype.reset = function() {
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = Math.ceil(Math.random() * 3) * 83 - 11;
 };

 // Hide item when no longer needed (end game, etc.)
 Item.prototype.hide = function() {
     this.visible = false;
     player.carryItem = false;
     this.x = -101;
     this.y = -101;
 };

 // Draw the item on the game screen
 Item.prototype.render = function() {
     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
 };

// Create array from which to select random artifacts to be place on game board
var artifacts = [{
    name: "Gem Blue",
    sprite: 'images/Gem Blue.png',
    points: 1,
    lives: 0
}, {
    name: "Gem Green",
    sprite: 'images/Gem Green.png',
    points: 2,
    lives: 0
}, {
    name: "Gem Orange",
    sprite: 'images/Gem Orange.png',
    points: 4,
    lives: 0
}, {
    name: "Key",
    sprite: 'images/Key.png',
    points: 8,
    lives: 0
}, {
    name: "Star",
    sprite: 'images/Star.png',
    points: 10,
    lives: 0
}, {
    name: "Heart",
    sprite: 'images/Heart.png',
    points: 12,
    lives: 1
}];

// instantiate artifacts object
artifact = new Item(-100,-100);
artifact.reset();

// selects a random artifact index from the artifacts array. this will be used
// to determine the characteristics of the random artifact generated
function randArtifactIndex() {
    var artifactsIndex = randomize(0, artifacts.length);
    return artifactsIndex;
}

// generates random number within a given range
function randomize(low, high) {
    var result = Math.floor(Math.random() * (high - low + 1) + low);
    return result;
}
// this object holds collectables or gems that the player can collect
/*var possibleGems = [
      'images/Gem Blue.png',
      'images/Gem Green.png',
      'images/Gem Orange.png',
      'images/Heart.png',
      'images/Rock.png',       // obstacle
      'images/Key.png'
    ],
    chosenGems = [],              // contains randomly selected gems
    numGems,                      // number of gems to hold in chosenGems
    gemX, gemY;  // random coordinates for gems on canvas based on numRows and numCols

// this array holds three randomly selected items from the possibleGems
// object that will be placed in the canvas. Code selects a random
// key in the possibleGems object and based on that, selects the
// corresponding gem or obstacle to include.
numGems = 3;
chosenGems.push(possibleGems[0]); */

/*for (var i = 0; i < numGems; i++) {
  chosenGems.push(possibleGems[Math.floor(Math.random() *
    (possibleGems.length - 0 + 1)) + 0]);
}*/

// Generate random coordinates to place the gems or obstacles.
// Place collectables anywhere other than on the water
/*for (var j = 0; j < numGems; j++) {
  gemX = (Math.floor(Math.random() * (numCols - 1 + 1)) + 1) * 101;
  gemY = (Math.floor(Math.random() * (numRows - 1 + 1)) + 1) * 83;

  // draw gems in the chosenGems array at random locations on the canvas
  ctx.drawImage(Resources.get(chosenGems[j]), gemX, gemY);
}*/
