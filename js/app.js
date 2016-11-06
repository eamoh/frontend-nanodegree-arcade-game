// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // This sets the initial position of the Enemy to a random
    // location on one of the three rows of stone. Ideal y-coordinates for
    // Enemies in stone blocks are 63, 147, and 230 and are contained in
    // the possibleY array. Y-coordinates will be
    // limited to these to make it easy to track movements.
    // Multiplied by 83 to be consistent with Engine.render().
    var initialX, initialY, possibleY, x, y;

    this.initialX = 101;

    // selects a y-coordinate in possibleY by randomly selecting an index in
    // the possibleY array. The code returns a random index (integer) between
    // 0 (starting index) and the last index in the array.
    possibleY = [63, 147, 230];
    this.initialY = possibleY[Math.floor(Math.random() * (possibleY.length - 0)) + 0];
    this.x = this.initialX;
    this.y = this.initialY;

    // sets the Enemy speed by generating a random number
    // that will eventually be multiplied by dt to cause movement
    var speed;
    this.speed = Math.floor((Math.random() * 5) + 1);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // moves across the screen by only updating x-coordinate.
    this.x = this.speed * dt;

    // Handles collision with the Player. Checks to see if there's
    // a collision by comparing if x and y-coordinates are the same.
    // If so, the Player is returned to the start square.
    if(this.x === Player.x && this.y === Player.y) {
      this.x = this.initialX;
      this.y = this.initialY;
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
  // The image/sprite for our Player, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/char-boy.png';

  // Sets the Player initial location to the start square.
  // From engine.js, the start square is located in the last row
  // at the bottom (grass) and in the 3rd column.
  var initialX, initialY, x, y;
  this.initialX = 3 * 101;
  this.initialY = 6 * 83;

  this.x = this.initialX;
  this.y = this.initialY;
};

Player.prototype.update = function(dt) {
  // moves across the screen by only updating x-coordinate.
  this.x = this.speed * dt;

  // Handles collision with the Player. Checks to see if there's
  // a collision by comparing if x and y-coordinates are the same.
  // If so, the Player is returned to the start square.
  if(this.x === Enemy.x && this.y === Enemy.y) {
    this.x = this.initialX;
    this.y = this.initialY;
  }
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// receives user input and moves the player according to that input
Player.prototype.handleInput = function(allowedKeys) {
  // Moves the Player while ensuring the player cannot move outside
  // the boundaries of canvas as specifi
  while (this.x >= 101 && this.x <= canvas.width && this.y >= 83 &&
    this.y <= canvas.height) {
    switch(allowedKeys) {
      case 'left':
        this.x -= 101;
        break;
      case 'right':
        this.x += 101;
        break;
      case 'up':
        this.y += 83;
        break;
      case 'down':
        this.y -= 83;
        break;
    }
  }

  // Implements the Player.reset() method
  this.reset();
};

Player.prototype.reset = function() {
  // checks to see if player has reached the water and if so, resets to
  // initial location
  if(this.x === 83) {
    this.x = this.initialX;
    this.y = this.initialY;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();

// create several new Enemies objects (3) and place them in the allEnemies array
for(var i = 0; i < 3; i++) {
  allEnemies.push(new Enemy());
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
