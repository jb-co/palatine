function AudioQue(arg_path, arg_amount) {
    this.src                    = arg_path;
    this.audioQue               = this.createArray(arg_path, arg_amount);
    this.currentIndex           = 0;
}

AudioQue.prototype.createArray  = function(arg_path, arg_amount){
    var tArray                  = new Array(arg_amount);
    for (var i = 0, len = tArray.length; i < len; i++) {
        tArray[i]               = new Audio(arg_path);
    }
    return tArray;
}

AudioQue.prototype.play         = function() {
    this.audioQue[this.currentIndex].play();
    this.currentIndex          += 1;
    
    if(this.currentIndex > this.audioQue.length - 1) this.currentIndex = 0;
}

