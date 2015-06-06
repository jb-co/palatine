function AudioQue(arg_path, arg_amount) {
  this.src = arg_path;
  this.audioQue = this.createArray(arg_path, arg_amount);
  this.currentIndex = 0;
}
AudioQue.prototype.createArray = function(arg_path, arg_amount) {
  var tArray = new Array(arg_amount);
  for (var i = 0, len = tArray.length;i < len;i++) {
    tArray[i] = new Audio(arg_path);
  }
  return tArray;
};
AudioQue.prototype.play = function() {
  this.audioQue[this.currentIndex].play();
  this.currentIndex += 1;
  if (this.currentIndex > this.audioQue.length - 1) {
    this.currentIndex = 0;
  }
};
var gCanvas;
var gCanvasWidth;
var gCanvasHeight;
var gContext;
var gGameState;
var gColor;
var gTileWidth = 8;
var gCounter = 0;
var gLoopID = 0;
var gLoading = false;
var keyState = {};
var State = {GAMEOVER:1, LOADING:2, RUNNING:3, PRELOAD:4};
var gSound = {jump:new AudioQue("./wav/jump.wav", 4), dead:new AudioQue("./wav/dead.wav", 1), breakTile:new AudioQue("./wav/break.wav", 4), swapState:new AudioQue("./wav/swap.wav", 1), win:new AudioQue("./wav/win.wav", 1), antiGrav:new AudioQue("./wav/antiGrav2.wav", 2), convey:new AudioQue("./wav/convey.wav", 2)};
var gStage = {width:40, height:30};
var gColorNormal = {background:"#222222", conveyerLeft:"#444444", conveyerRight:"#444444", bridge:"#333333", trap:"#333333", wall:"#555555", goal:"#FFFFFF", dead:"#00CC00", tele:"#CCCCCC", glue:"#111177", jump:"#771111", helm:"#117711", anti:"#999911"};
var gColorErotic = {background:"#441144", conveyerLeft:"#664466", conveyerRight:"#664466", bridge:"#663366", trap:"#663366", wall:"#994499", goal:"#FFCCFF", dead:"#CC00CC", tele:"#DDAADD", glue:"#111177", jump:"#771111", helm:"#117711", anti:"#999911"};
var gColorHell = {background:"#441111", conveyerLeft:"#664444", conveyerRight:"#664444", bridge:"#663333", trap:"#663333", wall:"#994444", goal:"#FFCCCC", dead:"#CC0000", tele:"#996666", glue:"#111177", jump:"#771111", helm:"#117711", anti:"#999911"};
var gColorArray = [gColorNormal, gColorErotic, gColorHell];
var gLEVELS = [{path:"./stage/intro0.bmp", quote:"The end is in the beginning and lies far ahead."}, {path:"./stage/intro1.bmp", quote:"Gravity is a habit that is hard to shake off."}, {path:"./stage/intro2.bmp", quote:"Question everything. Learn something. Answer nothing."}, {path:"./stage/intro3.bmp", quote:"Born on the ground. Live in the air!"}, {path:"./stage/intro4.bmp", quote:"Those who don't jump will never fly."}, {path:"./stage/stage1.bmp", quote:"What is important is to spread confusion, not eliminate it."}, 
{path:"./stage/stage2.bmp", quote:"If everything seems under control, you're not going fast enough."}, {path:"./stage/stage3.bmp", noJump:true, quote:"If you don't succeed at first, hide all evidence that you tried."}, {path:"./stage/stage4.bmp", quote:"The road to success is always under construction."}, {path:"./stage/stage5.bmp", quote:"To the well-organized mind, death is but the next great adventure."}, {path:"./stage/stage6.bmp", quote:"You suck."}, {path:"./stage/stage7.bmp", noJump:true, 
quote:"It's a long road but it's worth it."}, {path:"./stage/stage11.bmp", quote:"Irish I were drunk."}, {quote:"When in danger or in doubt, run in circles, scream and shout.", path:"./stage/stage12.bmp"}, {path:"./stage/stage99.bmp", noJump:true, quote:"Stop smell roses."}];
function GameState() {
  this.currentLevel = 0;
  this.currentState = State.PRELOAD;
  this.stageParagraph = document.getElementById("current_stage");
}
GameState.prototype.run = function() {
  switch(this.currentState) {
    case State.PRELOAD:
      this.currentState = State.LOADING;
      gLoading = true;
      this.mLevel = new Level(gLEVELS[this.currentLevel]);
      this.drawLevelStatus();
      break;
    case State.LOADING:
      if (!gLoading) {
        this.currentState = State.RUNNING;
      }
      break;
    case State.RUNNING:
      this.mLevel.update();
      switch(this.mLevel.mPlayer.stateID) {
        case 2:
          this.currentLevel += 1;
        case 1:
          this.currentState = State.PRELOAD;
          break;
      }
      if (gCounter % 4 == 0) {
        this.mLevel.draw();
      }
      if (gCounter++ == 1E3) {
        gCounter = 0;
      }
      break;
    default:
      this.mLevel.update();
  }
};
GameState.prototype.drawLevelStatus = function() {
  var tPrint = gLEVELS[this.currentLevel].quote;
  if (tPrint != this.stageParagraph.innerHTML) {
    this.stageParagraph.innerHTML = tPrint;
  }
};
function Level(arg_levelData) {
  gColor = gColorArray[Math.floor(Math.random() * 3)];
  this.mStage = 0;
  this.noJump = arg_levelData.noJump;
  this.readBMP(arg_levelData.path);
}
Level.prototype.update = function() {
  if (keyState[39] || keyState[68]) {
    this.mPlayer.mDir = 1;
    this.mPlayer.hasMoved = true;
  }
  if (keyState[37] || keyState[65]) {
    this.mPlayer.mDir = 2;
    this.mPlayer.hasMoved = true;
  }
  if (keyState[38] || (keyState[87] || keyState[32])) {
    if (!this.mPlayer.isAirborne && !this.noJump) {
      this.mPlayer.currentState.jumpVelocity = this.mPlayer.currentState.jumpForce;
      gSound.jump.play();
    }
  }
  this.mPlayer.update();
};
Level.prototype.draw = function() {
  gContext.fillStyle = gColor.background;
  gContext.fillRect(0, 0, gCanvasWidth, gCanvasHeight);
  for (var i = 0, len = this.mStage.length;i < len;i++) {
    if (this.mStage[i].isSolid) {
      this.mStage[i].draw(gContext);
    }
  }
  this.mPlayer.draw();
};
Level.prototype.getTile = function(arg_X, arg_Y) {
  if (arg_X < 0 || (arg_X > gCanvasWidth - 1 || (arg_Y > gCanvasHeight - 1 || arg_Y < 0))) {
    r = new Rect(0, 0, gColor.background);
    r.isSolid = false;
    return r;
  }
  return this.mStage[(arg_X / gTileWidth >> 0) + (arg_Y / gTileWidth >> 0) * gStage.width];
};
Level.prototype.readBMP = function(arg_path) {
  gLoading = true;
  var tStage = new Array, tCanvas = document.createElement("canvas");
  tCanvas.width = gStage.width;
  tCanvas.height = gStage.height;
  var tContext = tCanvas.getContext("2d"), tImage = new Image;
  tImage.onload = function() {
    tContext.drawImage(tImage, 0, 0);
    var tImageData = tContext.getImageData(0, 0, tCanvas.width, tCanvas.height);
    var tPixel = new Array;
    for (var row = 0;row < tCanvas.height;row++) {
      for (var col = 0;col < tCanvas.width;col++) {
        var tileData = tImageData.data[(col + row * tCanvas.width) * 4];
        switch(tileData) {
          case 212:
            var r = new Rect(col * gTileWidth, row * gTileWidth, gColor.wall);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 113:
            var r = new ConveyorBeltTile(col * gTileWidth, row * gTileWidth, gColor.conveyerLeft, -1);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 74:
            var r = new ConveyorBeltTile(col * gTileWidth, row * gTileWidth, gColor.conveyerLeft, 1);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 25:
            var r = new GoalTile(col * gTileWidth, row * gTileWidth, gColor.goal);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 189:
            var r = new RedTile(col * gTileWidth, row * gTileWidth, gColor.jump);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 218:
            var r = new HammerTile(col * gTileWidth, row * gTileWidth, gColor.helm);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 230:
            var r = new AntiGravityTile(col * gTileWidth, row * gTileWidth, gColor.anti, -1);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 187:
            var r = new AntiGravityTile(col * gTileWidth, row * gTileWidth, gColor.anti, 1);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 82:
            var r = new DeathTile(col * gTileWidth, row * gTileWidth, gColor.dead);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 107:
            var r = new TrapTile(col * gTileWidth, row * gTileWidth, gColor.trap);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 121:
            var r = new BridgeTile(col * gTileWidth, row * gTileWidth, gColor.bridge);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 190:
            var r = new GlueTile(col * gTileWidth, row * gTileWidth, gColor.glue);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 174:
            var r = new TeleTile(col * gTileWidth, row * gTileWidth, gColor.tele);
            tPixel[col + row * tCanvas.width] = r;
            break;
          case 192:
            gGameState.mLevel.mPlayer = new Player(col * gTileWidth, row * gTileWidth);
          default:
            var r = new Rect(col * gTileWidth, row * gTileWidth, gColor.background);
            r.isSolid = false;
            tPixel[col + row * tCanvas.width] = r;
            break;
        }
      }
    }
    gLoading = false;
    gGameState.mLevel.mStage = tPixel;
  };
  tImage.src = arg_path;
};
function main() {
  document.addEventListener("keydown", function(e) {
    keyState[e.keyCode || e.which] = true;
  }, true);
  document.addEventListener("keyup", function(e) {
    keyState[e.keyCode || e.which] = false;
  }, true);
  gCanvas = document.getElementById("mCanvas");
  gContext = gCanvas.getContext("2d");
  gCanvas.width = 320;
  gCanvas.height = 240;
  gCanvas.style.width = document.innerWidth + "px";
  gCanvas.style.height = document.innerHeight + "px";
  gCanvasWidth = 320;
  gCanvasHeight = 240;
  gContext.fillStyle = "#FF00FF";
  gContext.fillRect(0, 0, gCanvas.width, gCanvas.height);
  gGameState = new GameState;
  gLoopID = setInterval(loop, 8);
}
function loop() {
  gGameState.run();
}
;function Player(arg_X, arg_Y) {
  this.mBody = new Rect(arg_X, arg_Y + 8, "#999");
  this.mHead = new Rect(arg_X, arg_Y, "#777");
  this.diffrentStates = [new State_basic, new State_dead, new State_win, new State_red, new State_helm, new State_antiGravity, new State_sticky];
  this.currentState = this.diffrentStates[0];
  this.stateID = 0;
  this.mDir = 0;
  this.hasMoved = false;
  this.isAirborne = true;
}
Player.prototype.setPos = function(arg_x, arg_y) {
  this.mBody = new Rect(arg_x, arg_y + 8, this.currentState.colorBody);
  this.mHead = new Rect(arg_x, arg_y, this.currentState.colorHead);
};
Player.prototype.draw = function() {
  this.mBody.color = this.currentState.colorBody;
  this.mHead.color = this.currentState.colorHead;
  this.mBody.draw();
  this.mHead.draw();
};
Player.prototype.update = function() {
  var dX = this.currentState.VERTICAL_GRAVITY;
  var dY = 0;
  this.move(dX, dY);
};
Player.prototype.changeState = function(arg_state) {
  this.stateID = arg_state;
  this.currentState = this.diffrentStates[this.stateID];
  switch(arg_state) {
    case 1:
      gSound.dead.play();
      break;
    case 2:
      gSound.win.play();
      break;
    case 0:
    ;
    case 5:
      gSound.antiGrav.play();
      break;
    default:
      gSound.swapState.play();
  }
};
Player.prototype.move = function(dX, dY) {
  this.currentState.jumpVelocity += this.currentState.GRAVITY;
  dY = this.currentState.jumpVelocity;
  if (this.hasMoved) {
    if (this.mDir == 1) {
      dX += this.currentState.speed;
    } else {
      if (this.mDir == 2) {
        dX -= this.currentState.speed;
      }
    }
  }
  if (this.collision(dX, 0)) {
    dX = 0;
    if (this.stateID == 6) {
      this.isAirborne = false;
      return;
    }
  }
  if (this.collision(dX, dY)) {
    if (dY > 0 && this.stateID != 5) {
      this.isAirborne = false;
    }
    if (this.stateID == 5 && dY < 0) {
      this.isAirborne = false;
    }
    dY = 0;
    this.currentState.jumpVelocity = 0;
  } else {
    this.isAirborne = true;
  }
  this.mBody.move(dX, dY);
  this.mHead.move(dX, dY);
  this.mDir = 0;
  this.hasMoved = false;
};
Player.prototype.leftRect = function(rect) {
  return rect.left >= this.mHead.right && (rect.bottom >= this.mHead.top && rect.top <= this.mBody.bottom);
};
Player.prototype.rightRect = function(rect) {
  return rect.right <= this.mHead.left && (rect.bottom >= this.mHead.top && rect.top <= this.mBody.bottom);
};
Player.prototype.overRect = function(rect) {
  return rect.top >= this.mBody.bottom && (rect.left < this.mBody.right && rect.right > this.mHead.left);
};
Player.prototype.underRect = function(rect) {
  return rect.top <= this.mHead.top && (rect.left < this.mHead.right && rect.right > this.mHead.left);
};
Player.prototype.collision = function(arg_dX, arg_dY) {
  arg_dX = arg_dX >> 0;
  arg_dY = arg_dY >> 0;
  var collided = false;
  for (var i = 0;i < 4;i++) {
    if (gGameState.mLevel.getTile(this.mHead.left + i % 2 * 7 + arg_dX, this.mHead.top + (i / 2 >> 0) * 7 + arg_dY).isSolid) {
      gGameState.mLevel.getTile(this.mHead.left + i % 2 * 7 + arg_dX, this.mHead.top + (i / 2 >> 0) * 7 + arg_dY).interact(this);
      collided = true;
    }
    if (gGameState.mLevel.getTile(this.mBody.left + i % 2 * 7 + arg_dX, this.mBody.top + (i / 2 >> 0) * 7 + arg_dY).isSolid) {
      gGameState.mLevel.getTile(this.mBody.left + i % 2 * 7 + arg_dX, this.mBody.top + (i / 2 >> 0) * 7 + arg_dY).interact(this);
      collided = true;
    }
  }
  return collided;
};
function State_basic() {
  this.speed = 1;
  this.jumpVelocity = 0;
  this.GRAVITY = 0.17;
  this.VERTICAL_GRAVITY = 0;
  this.colorBody = "#777";
  this.colorHead = "#999";
  this.jumpForce = -5.2;
}
function State_win() {
}
function State_dead() {
  this.speed = 1;
  this.jumpVelocity = 0;
  this.GRAVITY = 0.2;
  this.VERTICAL_GRAVITY = 0;
  this.jumpForce = 0;
}
function State_red() {
  this.speed = 1;
  this.jumpVelocity = 0;
  this.GRAVITY = 0.1;
  this.VERTICAL_GRAVITY = 0;
  this.colorBody = "#AA0000";
  this.colorHead = "#999";
  this.jumpForce = -5.5;
}
function State_helm() {
  this.speed = 1;
  this.jumpVelocity = 0;
  this.GRAVITY = 0.2;
  this.VERTICAL_GRAVITY = 0;
  this.colorBody = "#777";
  this.colorHead = "#000";
  this.jumpForce = -4.8;
}
function State_antiGravity() {
  this.speed = 1;
  this.jumpVelocity = 0;
  this.GRAVITY = -0.2;
  this.VERTICAL_GRAVITY = 0;
  this.jumpForce = 5.2;
  this.colorBody = "#999";
  this.colorHead = "#777";
}
function State_sticky() {
  this.speed = 1;
  this.jumpVelocity = 0;
  this.GRAVITY = 0.17;
  this.jumpForce = -5.4;
  this.VERTICAL_GRAVITY = 0;
  this.colorBody = "#777";
  this.colorHead = "#999";
}
;function Rect(arg_x, arg_y, arg_color) {
  this.width = 8;
  this.left = arg_x;
  this.right = arg_x + this.width;
  this.top = arg_y;
  this.bottom = arg_y + this.width;
  this.color = arg_color;
  this.isSolid = true;
  this.isDestructable = true;
}
Rect.prototype.draw = function() {
  gContext.fillStyle = this.color;
  gContext.fillRect(this.left, this.top, this.width, this.width);
};
Rect.prototype.move = function(dX, dY) {
  this.left += dX >> 0;
  this.right += dX >> 0;
  this.top += dY >> 0;
  this.bottom += dY >> 0;
};
Rect.prototype.interact = function(arg_player) {
  arg_player.currentState.VERTICAL_GRAVITY = 0;
  if (arg_player.stateID == 4 && arg_player.underRect(this)) {
    this.isSolid = false;
    this.color = gColor.background;
    gSound.breakTile.play();
  }
  if (arg_player.stateID == 6) {
    arg_player.currentState.jumpVelocity = 0;
  }
};
function RedTile(arg_x, arg_y, arg_color) {
  Rect.call(this, arg_x, arg_y);
  this.isSolid = true;
  this.color = arg_color;
}
RedTile.prototype = Object.create(Rect.prototype);
RedTile.prototype.interact = function(player) {
  gGameState.mLevel.mPlayer.changeState(3);
};
function ConveyorBeltTile(arg_x, arg_y, arg_color, arg_dir) {
  Rect.call(this, arg_x, arg_y);
  this.dir = arg_dir;
  this.color = arg_color;
  this.isSolid = true;
  this.counter = 0;
  this.x = arg_x;
}
ConveyorBeltTile.prototype = Object.create(Rect.prototype);
ConveyorBeltTile.prototype.interact = function(player) {
  if (player.currentState.VERTICAL_GRAVITY <= -1) {
    player.currentState.VERTICAL_GRAVITY = 0;
  }
  if (player.currentState.VERTICAL_GRAVITY >= 1) {
    player.currentState.VERTICAL_GRAVITY = 0;
  }
  if (this.counter % 3 > 0) {
    player.currentState.VERTICAL_GRAVITY += this.dir;
  }
  this.counter++;
  if (this.counter == 10) {
    this.counter = 0;
  }
  gSound.convey.play();
};
function GoalTile(arg_x, arg_y, arg_color) {
  Rect.call(this, arg_x, arg_y, arg_color);
}
GoalTile.prototype = Object.create(Rect.prototype);
GoalTile.prototype.interact = function(playerState) {
  gGameState.mLevel.mPlayer.changeState(2);
};
function AntiGravityTile(arg_x, arg_y, arg_color, arg_dir) {
  Rect.call(this, arg_x, arg_y, arg_color);
  this.counter = 0;
  this.dir = arg_dir;
}
AntiGravityTile.prototype = Object.create(Rect.prototype);
AntiGravityTile.prototype.interact = function(player) {
  if (gGameState.mLevel.mPlayer.stateID == 1) {
    return;
  }
  if (gGameState.mLevel.mPlayer.stateID != 5 && this.dir == -1) {
    gGameState.mLevel.mPlayer.changeState(5);
  } else {
    if (this.dir == 1) {
      gGameState.mLevel.mPlayer.changeState(0);
    }
  }
};
function HammerTile(arg_x, arg_y, arg_color) {
  Rect.call(this, arg_x, arg_y, arg_color);
}
HammerTile.prototype = Object.create(Rect.prototype);
HammerTile.prototype.interact = function(player) {
  gGameState.mLevel.mPlayer.changeState(4);
};
function GlueTile(arg_x, arg_y, arg_color) {
  Rect.call(this, arg_x, arg_y, arg_color);
}
GlueTile.prototype = Object.create(Rect.prototype);
GlueTile.prototype.interact = function(player) {
  gGameState.mLevel.mPlayer.changeState(6);
};
function DeathTile(arg_x, arg_y, arg_color) {
  Rect.call(this, arg_x, arg_y, arg_color);
}
DeathTile.prototype = Object.create(Rect.prototype);
DeathTile.prototype.interact = function(player) {
  gGameState.mLevel.mPlayer.changeState(1);
};
function TrapTile(arg_x, arg_y, arg_color) {
  Rect.call(this, arg_x, arg_y, arg_color);
  this.counter = 0;
}
TrapTile.prototype = Object.create(Rect.prototype);
TrapTile.prototype.interact = function(player) {
  if (this.counter >= 2) {
    this.isSolid = false;
    this.color = gColor.background;
    this.counter = 2;
  }
  this.counter++;
};
function BridgeTile(arg_x, arg_y, arg_color) {
  Rect.call(this, arg_x, arg_y, arg_color);
  this.counter = 50 + arg_x * 2;
}
BridgeTile.prototype = Object.create(Rect.prototype);
BridgeTile.prototype.interact = function(player) {
};
BridgeTile.prototype.draw = function() {
  gContext.fillStyle = this.color;
  gContext.fillRect(this.left, this.top, this.width, this.width);
  if (this.counter <= 0) {
    this.isSolid = false;
    this.color = gColor.background;
    this.counter = 0;
  }
  this.counter -= 4;
};
function TeleTile(arg_x, arg_y, arg_color) {
  Rect.call(this, arg_x, arg_y, arg_color);
}
TeleTile.prototype = Object.create(Rect.prototype);
TeleTile.prototype.interact = function(player) {
  var dX = 0, dY = 0, stagePosX = this.left / 8 >> 0, stagePosY = this.top / 8 >> 0;
  if (player.overRect(this)) {
    dY += 1;
  }
  if (player.underRect(this)) {
    dY -= 1;
  }
  if (player.leftRect(this)) {
    dX += 1;
  }
  if (player.rightRect(this)) {
    dX -= 1;
  }
  while (stagePosX > 0 && (stagePosY > 0 && (stagePosX <= gStage.width && stagePosY < gStage.height))) {
    if (!gGameState.mLevel.mStage[stagePosX + stagePosY * gStage.width].isSolid && !gGameState.mLevel.mStage[stagePosX + (stagePosY + 1) * gStage.width].isSolid) {
      player.setPos(stagePosX * gTileWidth, stagePosY * gTileWidth);
      break;
    }
    stagePosX += dX;
    stagePosY += dY;
  }
};

