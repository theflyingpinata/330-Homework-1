'use strict';
window.onload = init;

let canvas;
let ctx;

const canvasWidth = 600, canvasHeight = 400;

let ball1;
let ballMid;

let paused;

function init() {
    canvas = document.querySelector('canvas');

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

    ball1 = new ball(100, 100, 25, "red");
    ballMid = new ball(canvasWidth / 2, canvasHeight / 2, 50, "black");
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
    ctx.globalAlpha = 1 / 20;
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


function cls(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}