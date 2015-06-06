



function Player(arg_X, arg_Y){
    this.mBody              =   new Rect(arg_X, arg_Y + 8, "#999");
    this.mHead              =   new Rect(arg_X, arg_Y, "#777");

    this.diffrentStates     = [ new State_basic(),
                                new State_dead(),
                                new State_win(),
                                new State_red(),
                                new State_helm(),
                                new State_antiGravity(),
                                new State_sticky()];      //create a state list

    this.currentState       =   this.diffrentStates[0];   //set basic state
    this.stateID            =   0;
    this.mDir               =   0;
    this.hasMoved           =   false;
    this.isAirborne         =   true;
};

Player.prototype.setPos = function(arg_x, arg_y){
    this.mBody              =   new Rect(arg_x, arg_y + 8,  this.currentState.colorBody);
    this.mHead              =   new Rect(arg_x, arg_y,      this.currentState.colorHead);
}

Player.prototype.draw = function(){
    
    
    this.mBody.color = this.currentState.colorBody;
    this.mHead.color = this.currentState.colorHead;
    this.mBody.draw();
    this.mHead.draw();
          
};

Player.prototype.update = function(){
    
    
    var dX                  =   this.currentState.VERTICAL_GRAVITY;
    var dY                  =   0;
    this.move(dX, dY);
    
};

Player.prototype.changeState = function(arg_state) {
    this.stateID = arg_state;
    this.currentState = this.diffrentStates[this.stateID];
    switch (arg_state) {
        case 1:             gSound.dead.play();
                            break;
        case 2:             gSound.win.play();
                            break;
        case 0:
        case 5:             gSound.antiGrav.play();
                            break;
        default:            gSound.swapState.play();
    }
}



Player.prototype.move = function(dX, dY){
     

    //if(this.isAirborne){
        this.currentState.jumpVelocity += this.currentState.GRAVITY;
        //if(this.currentState.jumpVelocity > 4) this.currentState.jumpVelocity = 4;
        dY = this.currentState.jumpVelocity;
//    }
    
    if(this.hasMoved){
        if (this.mDir == 1) {
            dX += this.currentState.speed;
        }else if (this.mDir == 2) {
            dX -= this.currentState.speed;
        }
    }
    
    //check collision right/left
    if(this.collision(dX, 0)){
        dX = 0;
        if(this.stateID == 6){ 
            this.isAirborne = false;
            
            return;
        }
    }
   
    
    //check collision up/down
    if(this.collision(dX, dY)){ 
        
        if(dY > 0 && (this.stateID != 5)) this.isAirborne = false;
        if((this.stateID == 5) && dY < 0){
            this.isAirborne = false;
        }
        
        dY = 0;
        this.currentState.jumpVelocity = 0;
        
       
        
    }else{
        this.isAirborne = true;
    }
    
    this.mBody.move(dX, dY);
    this.mHead.move(dX, dY);
    
    this.mDir       = 0;
    this.hasMoved   = false;
    
    
    
    
    
    
};

Player.prototype.leftRect = function(rect){
    return rect.left >= this.mHead.right && (rect.bottom >= this.mHead.top && rect.top <= this.mBody.bottom);
}

Player.prototype.rightRect = function(rect){
    return rect.right <= this.mHead.left && (rect.bottom >= this.mHead.top && rect.top <= this.mBody.bottom);
}

Player.prototype.overRect = function(rect){
    return rect.top >= this.mBody.bottom && (rect.left < this.mBody.right && rect.right > this.mHead.left); 
}

Player.prototype.underRect = function(rect){  
    return rect.top <= this.mHead.top && (rect.left < this.mHead.right && rect.right > this.mHead.left);   
}

Player.prototype.collision = function(arg_dX, arg_dY){
    
    arg_dX = arg_dX >> 0;
    arg_dY = arg_dY >> 0;
    var collided = false;
    
    for(var i = 0; i < 4; i++){
       if(  gGameState.mLevel.getTile(this.mHead.left + (i%2)*7 + arg_dX, this.mHead.top + ((i/2) >> 0)*7 + arg_dY).isSolid){
            gGameState.mLevel.getTile(this.mHead.left + (i%2)*7 + arg_dX, this.mHead.top + ((i/2) >> 0)*7 + arg_dY).interact(this);
            collided = true;
            
        }
       if(  gGameState.mLevel.getTile(this.mBody.left + (i%2)*7 + arg_dX, this.mBody.top + ((i/2) >> 0)*7 + arg_dY).isSolid){
            gGameState.mLevel.getTile(this.mBody.left + (i%2)*7 + arg_dX, this.mBody.top + ((i/2) >> 0)*7 + arg_dY).interact(this);
            collided = true;
          
        }
    }
    return collided;
}

function State_basic(){
    
    this.speed              = 1;
    this.jumpVelocity       = 0;
    this.GRAVITY            = .17;
    this.VERTICAL_GRAVITY   = 0;
    this.colorBody          = '#777';
    this.colorHead          = '#999';
    this.jumpForce          = -5.2;
}

function State_win(){
   
}

function State_dead(){
    
    this.speed              = 1;
    this.jumpVelocity       = 0;
    this.GRAVITY            = .2;
    this.VERTICAL_GRAVITY   = 0;
    this.jumpForce          = 0;
}

function State_red(){
    
    this.speed              = 1;
    this.jumpVelocity       = 0;
    this.GRAVITY            = .1;
    this.VERTICAL_GRAVITY   = 0;
    this.colorBody          = '#AA0000';
    this.colorHead          = '#999';
    this.jumpForce          = -5.5;
}

function State_helm(){
    
    this.speed              = 1;
    this.jumpVelocity       = 0;
    this.GRAVITY            = .2;
    this.VERTICAL_GRAVITY   = 0;
    this.colorBody          = '#777';
    this.colorHead          = '#000';
    this.jumpForce          = -4.8;
}

function State_antiGravity(){
    
    this.speed              = 1;
    this.jumpVelocity       = 0;
    this.GRAVITY            = -0.2;
    this.VERTICAL_GRAVITY   = 0;
    this.jumpForce          = 5.2;
    this.colorBody          = '#999';
    this.colorHead          = '#777';
}

function State_sticky(){
    
    this.speed = 1;
    this.jumpVelocity = 0;
    this.GRAVITY = .17;
    this.jumpForce = -5.4;
    this.VERTICAL_GRAVITY   = 0;
    this.colorBody          = '#777';
    this.colorHead          = '#999';
    
    
}

