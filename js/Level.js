/*
 *  Tiles.
 *  actualValue     : canvasValue   : tileType
 *  199             : 212           : Wall
 *  100             : 113           : ConveyerLeft
 *  60              : 74            : ConveyerRight
 *  179             : 192           : Player
 *  40              : 25            : Goal
 *  100             : 121           : Bridge
 *  221             : 230           : Antigravity (activate)
 *  156             : 174           : TeleTile
 *  64              : 82            : Death by chocolate
 *  209             : 218           : HammerTile
 *  173             : 187           : Antigravity (deactivate)
 *  88              : 107           : TrapTile
 *  174             : 189           : RedTile
 *  206             : 218           : 
 *  176             : 190           : GlueTile
 *  173             : 189          
 */
function Level(arg_levelData){
    
 
    gColor                      = gColorArray[Math.floor(Math.random()*3)];

    this.mStage                 = 0;        
    this.noJump                 = arg_levelData.noJump;
    this.readBMP(arg_levelData.path);
    
};

Level.prototype.update = function(){

    if (keyState[39] || keyState[68]){
        
        this.mPlayer.mDir       = 1;
        this.mPlayer.hasMoved   = true;

    }    
    if (keyState[37] || keyState[65]){

        this.mPlayer.mDir       = 2;
        this.mPlayer.hasMoved   = true;

    }
    if (keyState[38] || keyState[87] || keyState[32]) {
        if (!this.mPlayer.isAirborne && !this.noJump) {
            this.mPlayer.currentState.jumpVelocity = this.mPlayer.currentState.jumpForce;
            gSound.jump.play();
            
        }
    }
    this.mPlayer.update();
};



Level.prototype.draw = function(){
    //gContext.beginPath();
    gContext.fillStyle = gColor.background;
    gContext.fillRect(0, 0, gCanvasWidth, gCanvasHeight);
    //gContext.closePath();
    for (var i = 0, len = this.mStage.length; i < len; i++) {
        if(this.mStage[i].isSolid) this.mStage[i].draw(gContext);
    }
    this.mPlayer.draw();
}



// - Get tile from current stage at arg_X, arg_Y
Level.prototype.getTile = function(arg_X, arg_Y){
    if(arg_X < 0 || arg_X  > gCanvasWidth - 1  || arg_Y > gCanvasHeight - 1 || arg_Y < 0){
        r = new Rect(0, 0, gColor.background);
        r.isSolid = false;
        return r;
    }
    return this.mStage[((arg_X / gTileWidth) >> 0) + ((arg_Y / gTileWidth) >> 0) * gStage.width];   
};



//Reads BMP and populates tPixel with tiles.

Level.prototype.readBMP             = function(arg_path) {
        gLoading = true;

    var tStage                      = new Array(),
        tCanvas                     = document.createElement("canvas");
        tCanvas.width               = gStage.width;
        tCanvas.height              = gStage.height;

    var tContext                    = tCanvas.getContext("2d"),
        tImage                      = new Image();  
        tImage.onload               = function() {

        tContext.drawImage(tImage,0,0);

    var tImageData                  = tContext.getImageData(0, 0, tCanvas.width, tCanvas.height);
    var tPixel                      = new Array();
    
        for (var row = 0; row < tCanvas.height; row++) {
            for (var col = 0; col < tCanvas.width; col++) {
                var tileData        = tImageData.data[(col + row * tCanvas.width) * 4];
                switch (tileData) {
                    
                    case 212:       var r       = new Rect(col * gTileWidth, row * gTileWidth, gColor.wall);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                    
                    //conveyor belt moving to the left
                    case 113:     
                                    var r       = new ConveyorBeltTile(col * gTileWidth, row * gTileWidth, gColor.conveyerLeft, -1);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                        
                        
                    case 74:        var r       = new ConveyorBeltTile(col * gTileWidth, row * gTileWidth, gColor.conveyerLeft, 1);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                    
                    //GoalTile
                    case 25:        var r       = new GoalTile(col * gTileWidth, row * gTileWidth, gColor.goal);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                        
                    //Red tile
                    case 189:       var r = new RedTile(col * gTileWidth, row * gTileWidth, gColor.jump);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                     
                    //Hammer tile
                    case 218:       var r = new HammerTile(col * gTileWidth, row * gTileWidth, gColor.helm);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                        
                    //Antigravity
                    case 230:       var r = new AntiGravityTile(col * gTileWidth, row * gTileWidth, gColor.anti, -1);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                        
                    //Antigravity (deactivate)    
                    case 187:       var r = new AntiGravityTile(col * gTileWidth, row * gTileWidth, gColor.anti, 1);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                        
                    case 82:        var r = new DeathTile(col * gTileWidth, row * gTileWidth, gColor.dead);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                    //Traptile     
                    case 107:       var r = new TrapTile(col * gTileWidth, row * gTileWidth, gColor.trap);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                    //BridgeTile    
                    case 121:       var r = new BridgeTile(col * gTileWidth, row * gTileWidth, gColor.bridge);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                        
                    //Gluetile   
                    case 190:       var r = new GlueTile(col * gTileWidth, row * gTileWidth, gColor.glue);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                    //TeleTile
                    case 174:       var r = new TeleTile(col * gTileWidth, row * gTileWidth, gColor.tele);
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
      
                        //player spawn
                    case 192:       gGameState.mLevel.mPlayer                = new Player(col * gTileWidth, row * gTileWidth);
                    default:        var r       = new Rect(col * gTileWidth, row * gTileWidth, gColor.background);
                                    r.isSolid   = false 
                                    tPixel[col + row * tCanvas.width] = r;
                                    break;
                }
            }
        }
        gLoading = false;
        gGameState.mLevel.mStage = tPixel;

    };
    tImage.src                      = arg_path;
};
