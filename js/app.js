// creating xStep for Player left and right movements and yStep for
// Player up and down movements. xStep is calculated as one-fifth of
// canvas width. yStep is set to 83 to reflect the same measurements in
// Engine.js
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
    var initialX, initialY, possibleY, x, y;

    this.initialX = 0;

    // selects a y-coordinate in possibleY by randomly selecting an index in
    // the possibleY array. The code returns a random index (integer) between
    // 0 (starting index) and the last index in the array.
    this.possibleY = [73, 156, 239];
    this.initialY = this.possibleY[Math.floor(Math.random() * (this.possibleY.length - 0)) + 0];
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
      this.y = this.possibleY[Math.floor(Math.random() * (this.possibleY.length - 0)) + 0];
      this.speed = Math.floor((Math.random() * 50) + 100);
    }


    // Handles collision with the Player. Checks to see if there's
    // a collision by comparing if x and y-coordinates are the same.
    // If so, the Player is returned to the start square.
    if (this.x === Player.x && this.y === Player.y) {
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
    this.sprite = 'images/char-boy.png';

    // Sets the Player initial location to the start square.
    var initialX, initialY, x, y, speed;
    this.initialX = 200;
    this.initialY = 405;

    this.x = this.initialX;
    this.y = this.initialY;
};

Player.prototype.update = function(dt) {
    this.dt = dt;

    // Handles collision with the Player. Checks to see if there's
    // a collision by comparing if x and y-coordinates are the same.
    // If so, the Player is returned to the start square.
    if (this.x === Enemy.x && this.y === Enemy.y) {
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
    //if ((this.x >= -2 && this.x <= 402) && (this.y >= -10 && this.y <= 405)) {
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
    //}

    // Implements the Player.reset() method
    this.reset();
};

Player.prototype.reset = function() {
    // checks to see if player has reached the water and if so, resets to
    // initial location
    if (this.y === -10) {
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
for (var i = 0; i < 3; i++) {
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
