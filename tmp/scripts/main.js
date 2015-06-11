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

/**
 * Created by aaron.jin on 15/6/10.
 */

"use strict";


var orientLayer = document.getElementById("orientLayer");
//判断横屏竖屏
function checkDirect() {
    if (document.documentElement.clientHeight >= document.documentElement.clientWidth) {
        return "portrait";
    } else {
        return "landscape";
    }
}
//显示屏幕方向提示浮层
function orientNotice() {
    var orient = checkDirect();
    if (orient === "landscape") {
        orientLayer.style.display = "none";
    } else {
        orientLayer.style.display = "block";

    }
}
function init() {

//去除URL条
    setTimeout(scrollTo, 0, 0, 0);

    orientNotice();
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
        setTimeout(orientNotice, 200);
        console.log($(window).width() + " " + $(window).height());
    });

    //防橡皮筋效果
    document.addEventListener('touchmove', preventDefault, false);

    document.body.addEventListener('touchmove', function (ev) {
        var target = ev.target;

        // 在 scroller 上滑动，阻止事件冒泡，启用浏览器默认行为。
        if (isScroller(target)) {
            ev.stopPropagation();
        }
    }, false);

    // 尝试去除微信顶端导航，未成功
    //document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    //    WeixinJSBridge.call('hideToolbar');
    //    WeixinJSBridge.call('hideOptionMenu');
    //});
}

function preventDefault(ev) {
    ev.preventDefault();
}

function isScroller(el) {

    // 判断元素是否为 scroller
    return el.classList.contains('scroller');
}



$(function () {
    init();
    $(window).resize(function () {
        $('Canvas').width($(window).width());
        $('Canvas').height($(window).height());
    }).trigger('resize');

    canvasInit();

    console.log('main!!');
});

(function() {
    if (document.body) { setupEmbed(); }
    else { document.addEventListener("DOMContentLoaded", setupEmbed); }

    function setupEmbed() {
        if (window.top != window) {
            document.body.className += " embedded";
        }
    }

    var o = window.examples = {};
    o.showDistractor = function(id) {
        var div = id ? document.getElementById(id) : document.querySelector("div canvas").parentNode;
        div.className += " loading";
    };

    o.hideDistractor = function() {
        var div = document.querySelector(".loading");
        div.className = div.className.replace(/\bloading\b/);
    };
})();