// -- main -- //
function main(){
    document.addEventListener('keydown',function(e){
        keyState[e.keyCode || e.which] = true;
    },true);    
    document.addEventListener('keyup',function(e){
        keyState[e.keyCode || e.which] = false;
    },true);
    
    gCanvas = document.getElementById("mCanvas");
    gContext = gCanvas.getContext("2d");
    
    gCanvas.width       = 320;
    gCanvas.height      = 240;
    
    gCanvas.style.width = document.innerWidth + "px";
    gCanvas.style.height = document.innerHeight + "px";
    
    gCanvasWidth = 320;
    gCanvasHeight = 240;
    
    gContext.fillStyle = "#FF00FF";
    gContext.fillRect(0, 0, gCanvas.width, gCanvas.height);
    
    gGameState = new GameState();
    gLoopID = setInterval(loop, 8);
}

function loop() {
    gGameState.run();
    
}

