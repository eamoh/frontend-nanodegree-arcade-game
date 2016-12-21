frontend-nanodegree-arcade-game
===============================

Students should use this [rubric](https://review.udacity.com/#!/projects/2696458597/rubric) for self-checking their submission. Make sure the functions you write are **object-oriented** - either class functions (like Player and Enemy) or class prototype functions such as Enemy.prototype.checkCollisions, and that the keyword 'this' is used appropriately within your class and class prototype functions to refer to the object the function is called upon. Also be sure that the **readme.md** file is updated with your instructions on both how to 1. Run and 2. Play your arcade game.

For detailed instructions on how to get started, check out this [guide](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).

## Classic Arcade Game

### Running the Game
To run the game, open index.html in your web browser.

### Game Rules
This is the Frogger Game. The goal of this game is to gather as many artifacts (gems, keys, hearts) as possible within a given time period, while avoiding the ladybugs. The game starts automatically. I hope you enjoy.

-   Refresh the webpage to start a new game
-   Use arrow keys to move left, right, up, down. The following keys can also be used:
    *   _Enter_: select a player
    *   _Spacebar_ or _'P'_: pause game
    *   _'S'_: stop game
-   Score points when you gather artifacts:
    *   Blue gem: 1 points
    *   Green gem: 2 points
    *   Orange gem: 4 points
    *   Key: 8 points
    *   Star: 10 points
    *   Heart: 12 points + 1 life
-   You lose 3 points and a life when you run into a ladybug
-   Game ends when:
    *   You have no lives left, and / or
    *   You run out of time i.e. the timer reaches 00:00min
