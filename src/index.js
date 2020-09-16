'use strict';
window.onload = init;

let canvas;
let ctx;

const canvasWidth = 600, canvasHeight = 400;

let ball1;
let ballMid;

let paused;

let ball1SizeSlider;
let ball2SizeSlider;

let alphaSlider;
let alphaLabel;


function init() {
    canvas = document.querySelector('canvas');
    alphaSlider = document.querySelector("#alphaSlider");
    alphaLabel = document.querySelector("#alphaLabel");
    ball1SizeSlider = document.querySelector("#size1Slider");
    ball2SizeSlider = document.querySelector("#size2Slider");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    document.querySelector("#playButton").onclick = function () {
        if (paused) {
            paused = false;
            loop();
        }
    };

    document.querySelector("#pauseButton").onclick = function () {
        paused = true;
    };

    alphaSlider.oninput = updateLabel("#alphaLabel", "#alphaSlider");

    //ball1SizeSlider.oninput = updateLabel("#sizeLabel", "#sizeSlider");
    ball1SizeSlider.addEventListener("input", updateLabel("#size1Label", "#size1Slider"));
    ball2SizeSlider.addEventListener("input", updateLabel("#size2Label", "#size2Slider"));

    ball1 = new ball(100, 100, 25, "red");
    ballMid = new ball(canvasWidth / 2, canvasHeight / 2, 50, "black");

    ball1SizeSlider.addEventListener("input", updateBallSize(ball1));
    ball2SizeSlider.addEventListener("input", updateBallSize(ballMid));

    kctLIB.drawBall(ctx, ballMid);
    kctLIB.drawBall(ctx, ball1);

    loop();
}


function loop() {
    if (paused) {
        return;
    }
    requestAnimationFrame(loop);

    ctx.save();
    ctx.fillStyle = "white";
    ctx.globalAlpha = 1 / alphaSlider.value;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
    //cls(ctx);

    ball1.seek(ballMid);
    ballMid.seek(ball1);
    ball1.update(ballMid);
    ballMid.update(ball1);
    ball1.checkEdges(canvasWidth, canvasHeight);
    ballMid.checkEdges(canvasWidth, canvasHeight);
    //console.log(`Velocity: ${ball1.velocity.x}, ${ball1.velocity.y}`)

    kctLIB.drawBall(ctx, ballMid);
    kctLIB.drawBall(ctx, ball1);
}

function updateBallSize(ball) {
    return function (e) {
        ball.radius = e.target.value;
    }
}

function updateLabel(labelName, controlName) {
    return function () {
        document.querySelector(labelName).innerHTML = document.querySelector(controlName).value;
    }
}

function cls(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}