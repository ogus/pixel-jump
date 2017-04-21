WebFontConfig = {
  google: { families: [ 'Racing+Sans+One', 'Nova+Square' ] }
};

(function(){ // load fonts on Google Font dynamicallly
  var s = document.createElement('script');
  s.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';
  s.type = 'text/javascript';
  document.getElementsByTagName("head")[0].appendChild(s);
})();


var requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame;
})();

var cancelAnimFrame = (function(){
  return  window.cancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame    ||
          window.oCancelAnimationFrame      ||
          window.msCancelAnimationFrame;
})();

function Game(elementID,param){
  if(Game._this){ return Game._this; }
  Game._this = this;

  if(param === undefined){ param = {}; }
  this.gameHeight = parseInt(param.canvasHeight) > 0 ? parseInt(param.canvasHeight) : 480;
  this.gameWidth = parseInt(param.canvasWidth) > 0 ? parseInt(param.canvasWidth) : 320;

  this.canvas = document.getElementById(elementID);
  this.canvas.width = this.gameWidth;
  this.canvas.height = this.gameHeight;
  this.ctx = this.canvas.getContext('2d');
  this.ctx.textAlign = "center";
	this.ctx.textBaseline = "middle";

  this.gameSpeed = 120;   // speed of obstacles
  this.score = 0;
  this.bestScore = 0;
  this.player;     // the moving cube
  this.world;
  this.state;

  this.playerColor;
  this.worldColor;
  this.backgroundColor;
  this.titleColor;
  this.textColor;

  this.then, this.now, this.dt;
  this.requestId;
  this.pause = false;

  this.gameKey;
  this.key = null;
  this.keyDone = false;

  this.GAME_STATE = Game.GAME_STATE;

  this.init(param);
}

Game.GAME_STATE = {
  INTRO: 'INTRO',
  GAME: 'GAME',
  SCORE: 'SCORE'
}

Game.prototype.init = function(param) {
  this.state = this.GAME_STATE.INTRO;
  this.player = new Player(this);
  this.world = new World(this);

  this.setColor(param.playerColor,param.worldColor,param.backgroundColor,param.textColor);
  this.setSize(param.width,param.height,param.border);

  this.gameKey = " ";
  this.setListener();

  this.then = Date.now();
  this.mainLoop();
};

Game.prototype.setListener = function(){
  window.addEventListener("keydown", function(e){
    e.preventDefault();
    Game._this.key = e.key;
  }, false);

  window.addEventListener("keyup", function(e){
    Game._this.key = null;
    Game._this.keyDone = false;
  }, false);

  this.canvas.addEventListener("click", function(e){
    Game._this.togglePause();
  }, false);
};

Game.prototype.mainLoop = function(){
  Game._this.now = Date.now();
  Game._this.dt = (Game._this.now - Game._this.then) / 1000;

  Game._this.update();
  Game._this.draw();

  Game._this.then = Game._this.now;
  Game._this.requestId = requestAnimFrame(Game._this.mainLoop);
}

Game.prototype.update = function(){
  this.keydownHandler();

  this.player.update(Game._this.dt);

  if(this.state == this.GAME_STATE.GAME){
    if(this.player.posY + this.player.height/2 > this.gameHeight - this.world.groundHeight){    // player touch the ground
      this.gameover();
    }

    this.world.gapList.forEach(function(gap,i){
      gap.update(Game._this.dt);

      if(gap.collideWith(Game._this.player)) {    // player crash on obstacle
        Game._this.gameover();
      }

      if(gap.posX + gap.width/2 < Game._this.player.posX - Game._this.player.width/2 && !gap.used) {    // player pass the gap
        gap.used = true;
        Game._this.score++;
      }

      if(gap.posX + gap.width/2  < 0) {   // gap is out of screen, refresh it
        Game._this.world.refreshGap(i);
      }
    });
  }
};

Game.prototype.draw = function() {
  this.ctx.fillStyle = this.backgroundColor;
  this.ctx.fillRect(0,0, this.gameWidth, this.gameHeight);

  if(this.state == this.GAME_STATE.INTRO){
    this.world.render(this.ctx);
    this.player.render(this.ctx);

    this.ctx.strokeWidth = 1;
    this.ctx.strokeStyle = this.backgroundColor;
    this.ctx.font = "40pt Racing Sans One";
    this.ctx.fillStyle = this.titleColor;
    this.ctx.strokeText("Pixel Jump", this.gameWidth/2, this.gameHeight/4);
    this.ctx.fillText("Pixel Jump", this.gameWidth/2, this.gameHeight/4);

    this.ctx.font = "20pt Nova Square";
    this.ctx.fillStyle = this.textColor;
    this.ctx.strokeText("- SPACE -", this.gameWidth/2, this.gameHeight*3/4);
    this.ctx.fillText("- SPACE -", this.gameWidth/2, this.gameHeight*3/4);
  }
  else if(this.state == this.GAME_STATE.SCORE){
    this.world.render(this.ctx);
    this.player.render(this.ctx);

    this.ctx.strokeWidth = 1;
    this.ctx.strokeStyle = this.backgroundColor;
    this.ctx.fillStyle = this.textColor;
    this.ctx.font = "40pt Nova Square";
    this.ctx.strokeText("Game Over", this.gameWidth/2, this.gameHeight/4);
    this.ctx.fillText("Game Over", this.gameWidth/2, this.gameHeight/4);

    this.ctx.font = "30pt Nova Square";
    this.ctx.strokeText("Score: " + String(this.score), this.gameWidth/2, this.gameHeight/2);
    this.ctx.fillText("Score: " + String(this.score), this.gameWidth/2, this.gameHeight/2);

    this.ctx.font = "25pt Nova Square";
    this.ctx.strokeText("Best: " + String(this.bestScore), this.gameWidth/2, this.gameHeight/2 + 40);
    this.ctx.fillText("Best: " + String(this.bestScore), this.gameWidth/2, this.gameHeight/2 + 40);

    if(this.player.dead){
      this.ctx.font = "20pt Nova Square";
      this.ctx.strokeText("- SPACE -", this.gameWidth/2, this.gameHeight*3/4);
      this.ctx.fillText("- SPACE -", this.gameWidth/2, this.gameHeight*3/4);
    }
  }
  else{
    this.world.render(this.ctx);
    this.player.render(this.ctx);

    this.ctx.strokeWidth = 1;
    this.ctx.strokeStyle = this.backgroundColor;
    this.ctx.fillStyle = this.textColor;
    this.ctx.font = "50pt Nova Square";
    this.ctx.strokeText(String(this.score), this.gameWidth/2, 50);
    this.ctx.fillText(String(this.score), this.gameWidth/2, 50);

  }
};

Game.prototype.keydownHandler = function(){
  if(this.key == this.gameKey && !this.keyDone){
    this.keyDone = true;    // key has been handled

    if(this.state == this.GAME_STATE.INTRO){  //  start the game
      this.state = this.GAME_STATE.GAME;
      this.score = 0;
      this.player.playing = true;   // activate the player
      this.player.jump();
    }
    else if(this.state == this.GAME_STATE.GAME){
      this.player.jump();
    }
    else if(this.state == this.GAME_STATE.SCORE && this.player.dead){   // when player is totally dead, start again
      this.player.reset(this.gameWidth/2,this.gameHeight/2);
      this.world.reset();
      this.state = this.GAME_STATE.INTRO;

      if(this.playerColor == -1){
        var hsl = this.player.newColor();
        this.titleColor = "hsl(" + (hsl+45)%360 + ",100%,50%)";
      }
    }
  }
};

Game.prototype.togglePause = function(){
  this.pause = !this.pause;
  if(this.pause){
    cancelAnimFrame(this.requestId);
  }
  else{
    this.then = Date.now();
    requestAnimFrame(this.mainLoop);
  }
}

Game.prototype.gameover = function(){
  this.state = this.GAME_STATE.SCORE;
  this.player.die();

  if(this.score > this.bestScore){
    this.bestScore = this.score;
  }
};

Game.prototype.setSize = function(width,height,border){
  var width = parseInt(width), height = parseInt(height);
  var screenHeight, screenWidth;
  if(height > 0 && width > 0){
    screenHeight = height;
    screenWidth = width;
  }
  else if(height > 0){
    screenHeight = height;
    screenWidth = screenHeight*this.gameWidth/this.gameHeight;
  }
  else if(width > 0){
    screenWidth = width;
    screenHeight = screenWidth*this.gameHeight/this.gameWidth;
  }
  else{    // get size of parent element, without border / margin / padding
    var w = this.canvas.parentElement.clientWidth;
    var h = this.canvas.parentElement.clientHeight;

    var style = window.getComputedStyle(this.canvas.parentElement, null);
    h -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    w -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

    if(w/h > this.gameWidth/this.gameHeight){   // get the best ratio
      screenHeight = h;
      screenWidth = screenHeight * this.gameWidth/this.gameHeight;
    }
    else{
      screenWidth = w;
      screenHeight = screenWidth * this.gameHeight/this.gameWidth;
    }
  }

  var b = typeof(border) === 'boolean' ? border : true;
  if(b){
    this.canvas.style.border = "5px solid " + this.worldColor;
    screenHeight -= 10;
    screenWidth -= 10;
  }
  this.canvas.style.height = String(screenHeight)+"px";
  this.canvas.style.width = String(screenWidth)+"px";
};

Game.prototype.setColor = function(playerColor,worldColor,backgroundColor,textColor){
  this.playerColor = (typeof(playerColor) == 'string' && playerColor.length == 7) ? playerColor : -1;
  this.worldColor = (typeof(worldColor) == 'string' && worldColor.length == 7) ? worldColor : "#c1c0bf";
  this.backgroundColor = (typeof(backgroundColor) == 'string' && backgroundColor.length == 7) ? backgroundColor : "#31302b";
  this.textColor = (typeof(textColor) == 'string' && textColor.length == 7) ? textColor : "#ffffff";

  this.world.color = this.worldColor;
  if(this.playerColor == -1){
    var hsl = this.player.newColor();
    this.titleColor = "hsl(" + (hsl+45)%360 + ",100%,50%)";
  }
  else{
    this.player.color = this.playerColor;
    this.titleColor = this.worldColor
  }
};


function World(game){
  this.width = game.gameWidth;
  this.height = game.gameHeight;
  this.groundHeight = 20;
  this.color;

  this.gapHeight = 120;   // all gap data are stored in the World
  this.gapWidth = 50;
  this.gapSpace = 230;
  this.gapSpeed = game.gameSpeed;

  this.gapNumber = Math.ceil(this.width / this.gapSpace) + 1;
  this.gapList = new Array(this.gapNumber);

  this.reset();
}

World.prototype.reset = function(){
  var x = this.width+this.gapSpace, y;

  for(var i=0; i<this.gapList.length; i++){     // create all gaps
    y = Math.floor(Math.random() * (this.height - this.gapHeight*2 - this.groundHeight) + this.gapHeight);
    this.gapList[i] = new Gap(x,y,this);
    x += this.gapSpace;
  }
};

World.prototype.render = function(ctx){
  ctx.fillStyle = this.color;
  ctx.fillRect(0,this.height, this.width, -this.groundHeight);

  this.gapList.forEach(function(gap){
    gap.render(ctx);
  });
};

World.prototype.refreshGap = function(index){
  var prevIndex = index == 0 ? this.gapNumber - 1 : index - 1;
  var x = this.gapList[prevIndex].posX + this.gapSpace;
  var y = Math.floor(Math.random() * (this.height - 200) + 100);

  this.gapList[index].reset(x,y);
};

function Gap(x,y,world){
  this.width = world.gapWidth;
  this.height = world.gapHeight;
  this.used = false;

  this.posX = x;
  this.posY = y;
  this.maxY = world.height;
  this.speedX = world.gapSpeed;
  this.color = world.color;

  this.topSize = this.posY - this.height/2;
  this.bottomSize = this.maxY - (this.posY + this.height/2);
}

Gap.prototype.update = function(dt,speed){
  this.posX = this.posX - this.speedX*dt;
};

Gap.prototype.render = function(ctx){
  ctx.fillStyle = this.color;
  ctx.fillRect(this.posX - this.width/2, 0, this.width, this.topSize);
  ctx.fillRect(this.posX - this.width/2, this.posY + this.height/2, this.width, this.bottomSize);
};

Gap.prototype.reset = function(x,y){
  this.used = false;
  this.posX = x;
  this.posY = y;
  this.topSize = this.posY - this.height/2;
  this.bottomSize = this.maxY - (this.posY + this.height/2);
};

Gap.prototype.collideWith = function(player){
  if(player.posX + player.width/2 < this.posX - this.width/2 || player.posX - player.width/2 > this.posX + this.width/2){
    return false;
  }
  else if( (player.posY - player.height/2 > this.posY - this.height/2) && (player.posY + player.height/2 < this.posY + this.height/2) ){
    return false;
  }
  else{
    return true;
  }
};


function Player(game){
  this.width = 30;
  this.height = 30;

  this.posX = game.gameWidth/2;
  this.posY = game.gameHeight/2;
  this.maxY = game.gameHeight;

  this.speedY = 0;
  this.speedX = game.gameSpeed;
  this.gravity = -1000;
  this.playing = false;
  this.dying = false;
  this.dead = false;

  this.trailSize = this.posX*0.7;
  this.trail = new Array(this.trailSize);
  this.trail.fill([this.posX,this.posY]);

  this.color = game.playerColor;
  this.colorHsl;
  this.particles = new Array(100);
}

Player.prototype.update = function(dt){
  if(this.playing && !this.dying){    // update position
    this.posY = this.posY + this.speedY*dt;
    this.speedY = this.speedY - this.gravity*dt;
  }

  if(!this.dying){   // update trail
    for (var i = 0; i < this.trailSize-1; i++) {
      this.trail[i] = this.trail[i+1];
      this.trail[i][0] -= this.speedX*dt;
    }
    this.trail[this.trailSize-1] = [this.posX,this.posY];
  }

  if(this.dying){   // update explosion
    var numberActive = 0;
    this.particles.forEach(function(p){
      if(p.active){
        p.update(dt);
        numberActive++;
      }
    });
    if(numberActive == 0){
      this.dead = true;
    }
  }

};

Player.prototype.render = function(ctx){
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(this.trail[0][0],this.trail[0][1]);
  for (var i = 1; i < this.trailSize; i++) {
    ctx.lineTo(this.trail[i][0], this.trail[i][1]);
  }
  ctx.stroke();

  if(!this.dying) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.posX - this.width/2, this.posY - this.height/2, this.width, this.height);
  }

  if(this.dying && !this.dead){
    for (var i = 0; i < this.particles.length; i++) {
      if(this.particles[i].active){
        this.particles[i].draw(ctx);
      }
    }
  }
};

Player.prototype.jump = function(){
  if(this.posY >= 0){
    this.speedY = -350;
  }
};

Player.prototype.reset = function(x,y){
  this.speedY = 0;
  this.playing = false;
  this.dying = false;
  this.dead = false;

  this.posX = x;
  this.posY = y;
  this.trail.fill([this.posX,this.posY]);
};

Player.prototype.die = function(){
  this.dying = true;
  this.dead = false;

  var color, hsl;
  for (var i = 0; i < this.particles.length; i++) {
    if(this.color.length == 7){
      color = this.color;
    }
    else{
      hsl =  (this.colorHsl - 20 + Math.round(Math.random()*40)) % 360;		//random color, range -25;25 + initial color
      color = "hsl(" + hsl + ",100%,50%)";
    }
    this.particles[i] = new Particle(this.posX,this.posY,color);
  }
};

Player.prototype.newColor = function(){
  var hsl = Math.floor(Math.random()*360);
  this.color = "hsl(" + hsl + ",100%,50%)";
  this.colorHsl = hsl;
  return hsl;
};


function Particle(x,y,color){
  this.x = x;			//initial position
  this.y = y;
  this.dx = -100 + Math.random()*200;		//direction and speed
  this.dy = -100 + Math.random()*200;
  this.color = color;
  this.size = 6 + Math.random()*5;			//initial size, range 6;10
  this.active = true;

  this.update =  function(dt){
    this.x += this.dx*dt;
    this.y += this.dy*dt;
    this.size -= 7*dt
    if(this.size <0.4){ this.active = false; }
  };

  this.draw = function(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x-this.size/2,this.y-this.size/2, this.size,this.size);
  };
}
