function Rect(arg_x, arg_y, arg_color){
    this.width  = 8;
    this.left   = arg_x;
    this.right  = arg_x + this.width;
    this.top    = arg_y;
    this.bottom = arg_y + this.width;
    this.color  = arg_color;
    this.isSolid= true;
    this.isDestructable = true;
}

Rect.prototype.draw = function() {
    gContext.fillStyle = this.color;
    gContext.fillRect(this.left, this.top, this.width, this.width);
};

Rect.prototype.move = function(dX, dY) {
    this.left   += (dX >> 0);
    this.right  += (dX >> 0);
    this.top    += (dY >> 0);
    this.bottom += (dY >> 0);

};

Rect.prototype.interact = function(arg_player){
    
    arg_player.currentState.VERTICAL_GRAVITY = 0;
    
     if(arg_player.stateID == 4 && arg_player.underRect(this)){
            this.isSolid = false;
            this.color = gColor.background; 
            gSound.breakTile.play();
    }
    
    if(arg_player.stateID == 6) arg_player.currentState.jumpVelocity = 0;
 

}


// ----- RED JUMPTILLLEEEEEEEE ----------
function RedTile(arg_x, arg_y, arg_color){
    
    Rect.call(this, arg_x, arg_y);
   
    this.isSolid= true;
    this.color  = arg_color;
    
}

RedTile.prototype = Object.create(Rect.prototype);

RedTile.prototype.interact = function(player){
    
     gGameState.mLevel.mPlayer.changeState(3);
    
   
}

function ConveyorBeltTile(arg_x, arg_y, arg_color, arg_dir){
    
    Rect.call(this, arg_x, arg_y); 
    
    this.dir = arg_dir;
    this.color = arg_color;
    this.isSolid = true;
    this.counter = 0;
    this.x = arg_x;
    
}

ConveyorBeltTile.prototype = Object.create(Rect.prototype);

ConveyorBeltTile.prototype.interact = function(player){
    
    if(player.currentState.VERTICAL_GRAVITY <= -1) {player.currentState.VERTICAL_GRAVITY = 0;  }
    if(player.currentState.VERTICAL_GRAVITY >= 1 ) {player.currentState.VERTICAL_GRAVITY = 0;  }
    
    if(this.counter % 3 > 0)  
        player.currentState.VERTICAL_GRAVITY += this.dir;
        
   
    this.counter++;
    if(this.counter == 10) this.counter = 0;
    gSound.convey.play();
     
       
}

//-------------Goal Tile-------------------//
function GoalTile(arg_x, arg_y, arg_color){
    
    Rect.call(this, arg_x, arg_y, arg_color);
   
}

GoalTile.prototype = Object.create(Rect.prototype);

GoalTile.prototype.interact = function(playerState){

    gGameState.mLevel.mPlayer.changeState(2);  
}


//----------- Anti gravity tile ---------/

function AntiGravityTile(arg_x, arg_y, arg_color, arg_dir){
    Rect.call(this, arg_x, arg_y, arg_color);   
    this.counter = 0;
    this.dir = arg_dir;
}

AntiGravityTile.prototype = Object.create(Rect.prototype);
  
AntiGravityTile.prototype.interact = function(player){
    
    //dead, don't move a muscle!!!
    if(gGameState.mLevel.mPlayer.stateID == 1) return;
         
    if(gGameState.mLevel.mPlayer.stateID != 5 && this.dir == -1) gGameState.mLevel.mPlayer.changeState(5);  
    else if(this.dir == 1) {
      
            gGameState.mLevel.mPlayer.changeState(0);
      
    }
    
}
//------- Helmet TILE ------------------/

function HammerTile(arg_x, arg_y, arg_color){
    Rect.call(this, arg_x, arg_y, arg_color);
}

HammerTile.prototype = Object.create(Rect.prototype);

HammerTile.prototype.interact = function(player){
    gGameState.mLevel.mPlayer.changeState(4);
}

//------- Glue TILE ------------------/

function GlueTile(arg_x, arg_y, arg_color){
    Rect.call(this, arg_x, arg_y, arg_color);
}

GlueTile.prototype = Object.create(Rect.prototype);

GlueTile.prototype.interact = function(player){
    gGameState.mLevel.mPlayer.changeState(6);
}

//------- Death TILE------------------/

function DeathTile(arg_x, arg_y, arg_color){
    Rect.call(this, arg_x, arg_y, arg_color);
}

DeathTile.prototype = Object.create(Rect.prototype);

DeathTile.prototype.interact = function(player){
    gGameState.mLevel.mPlayer.changeState(1);
}


//-------Trap Tile ------------------/
function TrapTile(arg_x, arg_y, arg_color){
    Rect.call(this, arg_x, arg_y, arg_color);
    
    this.counter = 0;
}



TrapTile.prototype = Object.create(Rect.prototype);

TrapTile.prototype.interact = function(player){
    
   if(this.counter >= 2){
    
       this.isSolid = false;
       this.color = gColor.background;
       this.counter = 2;
   }
    
    this.counter++;
}


//--------------- Bridge Tile -------------/
function BridgeTile(arg_x, arg_y, arg_color){
    Rect.call(this, arg_x, arg_y, arg_color);
    
    this.counter = 50 + arg_x * 2;
   
}


BridgeTile.prototype = Object.create(Rect.prototype);

BridgeTile.prototype.interact = function(player){
    

}

BridgeTile.prototype.draw = function() {
    gContext.fillStyle = this.color;
    gContext.fillRect(this.left, this.top, this.width, this.width);

    if(this.counter <= 0){
        this.isSolid = false;
        this.color = gColor.background;
        this.counter = 0;
        
    }
   this.counter -= 4;
 
};


function TeleTile(arg_x, arg_y, arg_color){
    Rect.call(this, arg_x, arg_y, arg_color);
}

TeleTile.prototype = Object.create(Rect.prototype);
 

TeleTile.prototype.interact = function(player){
    var dX = 0,
        dY = 0,
        stagePosX = (this.left / 8) >> 0,
        stagePosY = (this.top  / 8) >> 0;

        if (player.overRect(this))  dY += 1; 
        if (player.underRect(this)) dY -= 1;
        if (player.leftRect(this))  dX += 1; 
        if (player.rightRect(this)) dX -= 1;

        while( stagePosX > 0 && stagePosY > 0 && stagePosX <= gStage.width && stagePosY < gStage.height){
            if (!gGameState.mLevel.mStage[stagePosX + stagePosY * gStage.width].isSolid && !gGameState.mLevel.mStage[stagePosX + (stagePosY + 1) * gStage.width].isSolid) {
                player.setPos(stagePosX * gTileWidth, stagePosY * gTileWidth);
                break;
            }
            stagePosX += dX;
            stagePosY += dY;
        };
}



