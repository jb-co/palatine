
function GameState(){
 
    this.currentLevel           = 0;
    this.currentState           = State.PRELOAD;
    this.stageParagraph         = document.getElementById("current_stage");
};

GameState.prototype.run = function() {

    switch (this.currentState) {
        case State.PRELOAD:     this.currentState = State.LOADING;
                                gLoading = true;
                                this.mLevel = new Level(gLEVELS[this.currentLevel]);
                                this.drawLevelStatus();
                                break;

        case State.LOADING:     if(!gLoading) this.currentState = State.RUNNING;
                                break;

        case State.RUNNING:     this.mLevel.update();
                                switch (this.mLevel.mPlayer.stateID) {
                                    case 2:         this.currentLevel      += 1;
                                    case 1:         this.currentState       = State.PRELOAD;
                                                    break;
                                }
                                
                                if (gCounter % 4 == 0) {
                                    this.mLevel.draw();
                                }
            
                                if(gCounter++ == 1000) gCounter = 0;
                                break;

        default:                this.mLevel.update();
    }
};

GameState.prototype.drawLevelStatus = function() {
    var tPrint                  = gLEVELS[this.currentLevel].quote; 
  
    if (tPrint != this.stageParagraph.innerHTML) this.stageParagraph.innerHTML = tPrint;
};



