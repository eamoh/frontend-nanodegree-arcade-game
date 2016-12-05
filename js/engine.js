/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     * also create a switchboard inside that controls the state of the game.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime, gameState;

    canvas.width = 505;
    canvas.height = 606;
    //doc.body.appendChild(canvas);
    $(".main-game").append(canvas);

    /* gameState toggles between 'start' and 'playing' to determine when to
     * show the start screen vs when to start the game.
     */
    gameState = 'playing';

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* uses the gameState switchboard to control the state of the game.*/
        switch(gameState) {
          case 'start':
            renderStartScreen();
            break;
          default:
            /* Call our update/render functions, pass along the time delta to
             * our update function since it may be used for smooth animation.
             */
            update(dt);
            render();
            break;
        }

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
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

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        artifact.render();
    }

    function renderStartScreen() {
        // draw the Start Screen canvas that the characters will be displayed on
        ctx.fillStyle = "#f0ffff"; // azure
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#800000"; // maroon
        ctx.fillText("Welcome! Please select your player: ", 50, 100);
        ctx.font = "20pt Impact";


        /* This array holds the characters a player can select from.
         */
        var possibleChars = [
                'images/char-boy.png',
                'images/char-cat-girl.png',
                'images/char-horn-girl.png',
                'images/char-pink-girl.png',
                'images/char-princess-girl.png'
            ];

        /* creates an object and that stores the image and coordinates of the
         * possible characters. This will be used to determine which character
         * the player selected
         */
        var Character = function(image, x, y) {
          this.sprite = image;
          this.x = x;
          this.y = y;
        };

        /* array to store character objects*/
        var playerChoices = [];

        // assigns the playerChoices array to the global variable for easy use in
        // app.js
        global.playerChoices = playerChoices;

        /* Loop through the possibleChars array and draw the possible characters
         * player can choose from.
         */
        for (var i = 0; i < possibleChars.length; i++) {
            /* The drawImage function of the canvas' context element
             * requires 3 parameters: the image to draw, the x coordinate
             * to start drawing and the y coordinate to start drawing.
             * We're using our Resources helpers to refer to our images
             * so that we get the benefits of caching these images, since
             * we're using them over and over.
             */
            playerChoices.push(new Character(possibleChars[i], i * xStep, yStep));
            ctx.drawImage(Resources.get(possibleChars[i]), i * xStep, yStep);
        }

        // Creates Selector object that is used to select player
        var Selector = function() {
          this.sprite = 'images/Selector.png';
          this.x = 0;
          this.y = yStep + 50;
        };

        // receives user input and moves the Selector according to that input
        Selector.prototype.handleInput = function(key) {
            // Moves the Selector while ensuring the Selector cannot move outside
            // the range of the options shown
            switch (key) {
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
        };

        // Draw the Selector on the screen
        Selector.prototype.render = function() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        };

        // instantiate and display Selector. Do not use var so it becomes global
        selector = new Selector();
        selector.render();

        // makes selector a global variable for easy access in app.js
        global.selector = selector;

        // This listens for key presses and sends the keys to your
        // Player.handleInput() method. You don't need to modify this.
        document.addEventListener('keyup', function(e) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };

            selector.handleInput(allowedKeys[e.keyCode]);
        });
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Heart.png',
        'images/Rock.png',       // obstacle
        'images/Key.png',
        'images/Selector.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.canvas = canvas;
})(this);
