var gCanvas;
var gCanvasWidth;
var gCanvasHeight;
var gContext;
var gGameState;
var gColor;
var gTileWidth                  = 8;
var gCounter                    = 0;
var gLoopID                     = 0;
var gLoading                    = false;
var keyState                    = {};    


var State = {
    GAMEOVER:                   1,
    LOADING:                    2,
    RUNNING:                    3,
    PRELOAD:                    4
};

var gSound = { 
    jump                        : new AudioQue('./wav/jump.wav',4),
    dead                        : new AudioQue('./wav/dead.wav',1),
    breakTile                   : new AudioQue('./wav/break.wav',4),
    swapState                   : new AudioQue('./wav/swap.wav',1),
    win                         : new AudioQue('./wav/win.wav',1),
    antiGrav                    : new AudioQue('./wav/antiGrav2.wav',2),
    convey                      : new AudioQue('./wav/convey.wav',2)

};

var gStage = { 
    width                       : 40, 
    height                      : 30
};

var gColorNormal = {

    background                  : "#222222",
    conveyerLeft                : "#444444",
    conveyerRight               : "#444444",
    bridge                      : "#333333",
    trap                        : "#333333",
    wall                        : "#555555",
    goal                        : "#FFFFFF",
    dead                        : "#00CC00",
    tele                        : "#CCCCCC",

    glue                        : "#111177",
    jump                        : "#771111",
    helm                        : "#117711",
    anti                        : "#999911"
};

var gColorErotic = {

    background                  : "#441144",
    conveyerLeft                : "#664466",
    conveyerRight               : "#664466",
    bridge                      : "#663366",
    trap                        : "#663366",
    wall                        : "#994499",
    goal                        : "#FFCCFF",
    dead                        : "#CC00CC",
    tele                        : "#DDAADD",

    glue                        : "#111177",
    jump                        : "#771111",
    helm                        : "#117711",
    anti                        : "#999911"
};

var gColorHell = {

    background                  : "#441111",
    conveyerLeft                : "#664444",
    conveyerRight               : "#664444",
    bridge                      : "#663333",
    trap                        : "#663333",
    wall                        : "#994444",
    goal                        : "#FFCCCC",
    dead                        : "#CC0000",
    tele                        : "#996666",

    glue                        : "#111177",
    jump                        : "#771111",
    helm                        : "#117711",
    anti                        : "#999911"
};

var gColorArray = [gColorNormal, gColorErotic, gColorHell];

var gLEVELS = [
    {
        path                    : "./stage/intro0.bmp",
        quote                   : "The end is in the beginning and lies far ahead."
        
    },
    {
        path                    : "./stage/intro1.bmp",
        quote                   : "Gravity is a habit that is hard to shake off."
    },
    {
        path                    : "./stage/intro2.bmp",
        quote                   : "Question everything. Learn something. Answer nothing."
    },
    {
        path                    : "./stage/intro3.bmp",
        quote                   : "Born on the ground. Live in the air!"
    },
    {
        path                    : "./stage/intro4.bmp",
        quote                   : "Those who don't jump will never fly."
    },
    {
        path                    : "./stage/stage1.bmp",
        quote                   : "What is important is to spread confusion, not eliminate it."
    },
    {
        path                    : "./stage/stage2.bmp",
        quote                   : "If everything seems under control, you're not going fast enough."
    },
    {
        path                    : "./stage/stage3.bmp",
        noJump                  : true,
        quote                   : "If you don't succeed at first, hide all evidence that you tried."
    },
    {
        path                    : "./stage/stage4.bmp",
        quote                   : "The road to success is always under construction."
    },
    {
        path                    : "./stage/stage5.bmp",
        quote                   : "To the well-organized mind, death is but the next great adventure."
    },
    {
        path                    : "./stage/stage6.bmp",
        quote                   : "You suck."
    },
    {
        path                    : "./stage/stage7.bmp",
        noJump                  : true,
        quote                   : "It's a long road but it's worth it."
    },
    {
        path                    : "./stage/stage11.bmp",
        quote                   : "Irish I were drunk."
    },
    {
        quote                   : "When in danger or in doubt, run in circles, scream and shout.",
        path                    : "./stage/stage12.bmp"
    },
    {
        path                    : "./stage/stage99.bmp",
        noJump                  : true,
        quote                   : "Stop smell roses."
    }
    
];


