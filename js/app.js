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

    // checks collision
    checkCollisions();
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
          if (this.y > -92) {
            this.y -= yStep;
          }
          break;
        case 'down':
          if (this.y < 405) {
            this.y += yStep;
          }
          break;
    }

    // checks to see if player has reached the water and if so, resets to
    // initial location
    if (this.y === -93) {
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
    if (player.x < (artifact.x + xStep) &&
        (player.x + xStep) > artifact.x &&
        player.y < (artifact.y + yStep) &&
        (player.y + yStep) > artifact.y) {
            artifact.playerCollide = true;
            artifact.hide();

            player.score += artifact.points;
            player.lives += artifact.lives;
            scoreBoard.update();
            lifeTracker.update();
            artifact.reset();
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
    this.playerCollide = false;
    this.points = artifacts[i].points;
    this.lives = artifacts[i].lives;
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
     this.hide();
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

 // Resets key variables for Item class
 Item.prototype.reset = function() {
    var i = randArtifactIndex(); // stores random index for use in object
    this.name = artifacts[i].name;
    this.sprite = artifacts[i].sprite;
    this.points = artifacts[i].points;
    this.lives = artifacts[i].lives;
    // sets item in random location to be picked up
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

// instantiate artifacts object by placing in random (x, y) location
artifact = new Item(Math.floor(Math.random() * 5) * 101,
            Math.ceil(Math.random() * 3) * 83 - 11);
//artifact.reset();

// selects a random artifact index from the artifacts array. this will be used
// to determine the characteristics of the random artifact generated
function randArtifactIndex() {
    var artifactsIndex = randomize(0, artifacts.length);
    return artifactsIndex;
}

// generates random number between min (included) and max (excluded)
function randomize(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/* Generates a countdown timer which will time user activity until the end.
 * Source code idea obtained from:
 * http://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
 * @param {number} duration     How long (in seconds) the timer should count down for
 * @param {text} display        The DOM selector to determine where in HTML to display timer
 */

/*
function countdownTimer(duration, display) {
    var start = Date.now(),
        diff,
        min,        // variable to store the number of minutes
        sec;        // variable to store the number of seconds

    function timer() {
        // get the number of seconds that have passed since
        // countdownTimer() was called. The ' | 0' expression makes sure the
        // number of seconds is an integer and not a float
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // calculates the mins and secs.
        min = (diff / 60) | 0;
        sec = (diff % 60) | 0;

        // adds '0' in front of minutes and seconds so it shows
        // as "03:45" vs "3:45" or "00:09" vs "00:9"
        if (min < 10) {
            min = "0" + min;
        } else {
            min = min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        } else {
            sec = sec;
        }

        // sets the content of the 'timerDisplay' (or #time) HTML element
        timerDisplay.textContent = min + ":" + sec;

        // diff = 0 at the very beginning, before the counter starts
        if (diff <= 0) {
            // add one second so that the countdown starts at the full
            // duration. e.g. 03:00 not 02:59
            start = Date.now() + 1000;
        }
    }
    // call timer() and also make sure it runs / updates every second
    timer();
    //setInterval(timer, 1000);
}
*/

/* Generates a countdown timer which will time user activity until the end.
 * Source code idea obtained from:
 * http://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
 * @param {number} duration     How long (in seconds) the timer should count down for
 * @param {text} time_delay     The time (in milliseconds), the timer should wait before
                                the specified function is executed. This parameter is optional
 */

function CountDownTimer(duration, time_delay) {
    this.duration = duration;
    this.time_delay = time_delay || 1000;   // defaults to 1000 milliseconds if no parameter chosenGems
    this.clockFunctions = [];        // stores functions to be executed in timer()
    this.running = false;           // tracks the state of the timer.
}

CountDownTimer.prototype.start = function() {
    if (this.running) {
        return;
    }
    this.running = true;
    var start = Date.now(),
        that = this,
        diff, timeObj;

    (function timer() {
        diff = that.duration - (((Date.now() - start) / 1000) | 0);

        if (diff > 0) {
            // if the countdown clock hasn't fully run down, run after every
            // 'time_delay' no. of seconds. Since 'time_delay' is 1sec (1,000ms)
            // by default, it means run timer() after every second, which is how
            // often we want our timer to be updating.
            setTimeout(timer, that.time_delay);
        } else {
            // stops timer from automatically restarting
            diff = 0;
            that.running = false;
        }

        timeObj = CountDownTimer.parse(diff);
        that.clockFunctions.forEach(function(ftn) {
            ftn.call(this, timeObj.minutes, timeObj.seconds);
        }, that);
    })();
};

// adds functions ('ftn') to the clockFunctions array so they can be executed
// in the timer() function when CountDownTimer.start() is called.
CountDownTimer.prototype.addClock = function(ftn) {
    if (typeof ftn ==='function') {
        this.clockFunctions.push(ftn);
    }
    return this;
};

// stops and restarts clock by toggling the this.running boolean for use in
// CountDownTimer.start()
CountDownTimer.prototype.expired = function() {
    return !this.running;
};

// splits time from secs to mins and secs and returns it
CountDownTimer.parse = function(seconds) {
    return {
        'minutes': (seconds / 60) | 0,
        'seconds': (seconds % 60) | 0
    };
};

// display countdown timer on canvas / HTML
window.onload = function() {

    var time = 15,      // set timer to 2mins
        display = document.querySelector('#timer'),
        stopClock = new CountDownTimer(time);

    // fill up clockFunctions array with functions to be executed during runtime
    stopClock.addClock(format).start();

    // format timer display format to "02:08 minutes"
    function format(minutes, seconds) {
        if (minutes < 10) {
            minutes = "0" + minutes;
        } else {
            minutes = minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        } else {
            seconds = seconds;
        }

        display.textContent = minutes + ':' + seconds;  // writes time into HTML
    }
};
