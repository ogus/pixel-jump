# Pixel Jump
A small Flappy Bird clone, easily customizable

## Getting Started
To play this Web game, you will need:

* the file 'pixel-jump.js' (or the minified version)
* a '<canvas>' element with an ID on your page

Then, just call an instance of the Game object with the canvas ID as an argument
'''javascript
new Game("canvasID");
'''

Congratulation, you can now play the game !

## Options
You can easily customize the game as you like. Here are the available parameters:

* **height**: the displayed height of the game
* **width**: the displayed width of the game
* **canvasHeight**: the actual height of the game
* **canvasWidth**: the actual width of the game
* **border**: draw a border around the game
* **playerColor**: the color of the cube
* **worldColor**: the color of the obstacles
* **backgroundColor**: the color of the background
* **textColor**: the color of the text

All parameters are *optionnal*, you can set only the height, or the textColor and border, or none of them.

'''javascript
new Game("canvasID", {width: "300", border: "true", playerColor: "#4ea6ca"});
'''

#### Width & Height
Set the dimension of the game on the page, in pixel. You can use either a string or a number.

**Default:** ' fill the HTML parent element, while conserving the width/height ratio '

*Examples:*
'''javascript
new Game("canvasID", {width: "300px"});
new Game("canvasID", {height: 500.12});
new Game("canvasID", {height: 480, width: "320"});
'''

#### canvasWidth & canvasHeight
Set the dimension of the canvas in the game. You can use either a string or a number.
You should be carefull when changing these values, as it can make the game unplayable or too easy depending on the height.

**Default:** ' canvasWidth = 320, canvasHeight = 480 '

*Examples:*
'''javascript
new Game("canvasID", {canvasHeight: "520"});
new Game("canvasID", {canvasHeight: "480.75px", canvasWidth: 623});
'''

#### border
Draw a border around the game, or hide it. The value must be a boolean.

**Default:** ' "true" '

*Examples:*
'''javascript
new Game("canvasID", {border: 'true'});
new Game("canvasID", {border: 'false'});
'''

#### playerColor
Set the color of the cube, and the trail behind. The color must be in hexadecimal, with all 6 hex values.

**Default:** ' random color '

*Examples:*
'''javascript
new Game("canvasID", {playerColor: "#ffffff"});
new Game("canvasID", {playerColor: "#4ea6ca"});
'''

#### worldColor
Set the color of the obstacle, and the border. The color must be in hexadecimal, with all 6 hex values.

**Default:** ' "#c1c0bf" '

*Examples:*
'''javascript
new Game("canvasID", {borderColor: "#942443"});
new Game("canvasID", {playerColor: "#8b0000"});
'''

#### backgroundColor
Set the color of the background behind the player. The color must be in hexadecimal, with all 6 hex values.

**Default:** ' "#31302b" '

*Examples:*
'''javascript
new Game("canvasID", {borderColor: "#31302b"});
new Game("canvasID", {playerColor: "#d8c9a6"});
'''

#### textColor
Set the color of the background behind the player. The color must be in hexadecimal, with all 6 hex values.

**Default:** ' "#ffffff" '

*Examples:*
'''javascript
new Game("canvasID", {borderColor: "#d1eae9"});
new Game("canvasID", {playerColor: "#004c4c"});
'''

## Demo
A [demonstration](demo) is available to show you how to implement the game in your own website. You can modify the HTML, CSS, and Javascript as you want to see how the game works.
Use the spacebar to launch the game and jump. You can also pause the game by clicking on the canvas.

## License
The source code of the game is licensed under the WTFPL - see the [WFTPL website](http://www.wtfpl.net/) for more details
