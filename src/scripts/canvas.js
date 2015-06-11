/**
 * Created by aaron.jin on 15/6/10.
 */

"use strict";


var stage, w, h, loader,container;
var bg1Img, bg2Img,shoes,grant, direction,bg1Alpha,bg2Alpha;

function canvasInit() {
    examples.showDistractor();
    stage = new createjs.Stage("Canvas");

    // grab canvas width and height for later calculations:
    w = stage.canvas.width;
    h = stage.canvas.height;

    var manifest = [
        {src: "bg-1.jpg", id: "bg1"},
        {src: "bg-2.jpg", id: "bg2"},
        {src: "shoes.png", id: "shoes"}
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "publish/images/");

}

function handleComplete() {
    bg1Alpha=0;
    bg2Alpha=0.03;
    examples.hideDistractor();

    container = new createjs.Container();

    bg1Img = new createjs.Bitmap(loader.getResult("bg1"));
    bg1Img.setTransform(0, 0 , h/640, h/640);
    bg1Img.alpha =1;

    bg2Img = new createjs.Bitmap(loader.getResult("bg2"));
    bg2Img.setTransform(0, 0 , h/640, h/640);
    bg2Img.alpha = 0;


    container.addChild(bg1Img);
    container.addChild(bg2Img);

    var spriteShoes = new createjs.SpriteSheet({
        framerate: 30,
        "images": [loader.getResult("shoes")],
        "frames": {"count": 8, "width": 600, "height": 300},
        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        "animations": {
            "start":[0],
            "end":[7],
            "run": {
                frames: [0,1,2,3,4,5,6,7],
                next:"end",
                speed: 0.5
            },
            "back": {
                frames: [7,6,5,4,3,2,1,0],
                next:"start",
                speed: 0.5
            }
        }
    });
    grant = new createjs.Sprite(spriteShoes, "run");
    grant.x = 1008/2-600/2;
    grant.y = 640/2-300/2;


    stage.addChild(container,grant);
    stage.update();

    direction='Forward';
    stage.addEventListener("stagemousedown", handleJumpStart);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
}

function handleJumpStart() {
    if(direction === 'Forward'){
        direction = 'Reverse';
        bg1Img.alpha =0;
        bg2Img.alpha =1;
        container.setChildIndex(bg1Img,1);
        container.setChildIndex(bg2Img,2);
        bg1Alpha=0.03;
        bg2Alpha=0;
        grant.gotoAndPlay("back");
    }else{
        direction = 'Forward';
        bg1Img.alpha =1;
        bg2Img.alpha =0;
        container.setChildIndex(bg1Img,2);
        container.setChildIndex(bg2Img,1);
        bg1Alpha=0;
        bg2Alpha=0.03;
        grant.gotoAndPlay("run");
    }
}

function tick(event) {
    bg1Img.alpha +=bg1Alpha;
    bg2Img.alpha += bg2Alpha;
    stage.update(event);
}
