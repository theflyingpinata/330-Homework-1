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

let velocityLabel;


function init() {
    canvas = document.querySelector('canvas');
    alphaSlider = document.querySelector("#alphaSlider");
    alphaLabel = document.querySelector("#alphaLabel");
    ball1SizeSlider = document.querySelector("#size1Slider");
    ball2SizeSlider = document.querySelector("#size2Slider");
    velocityLabel = document.querySelector("#velocityLabel");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    // Pausing and playing
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

    ball1SizeSlider.addEventListener("input", function (e) {
        ball1.radius = parseInt(e.target.value, 10);
    });
    ball2SizeSlider.addEventListener("input", function (e) {
        ballMid.radius = parseInt(e.target.value, 10);
    });

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


    if (ballMid.checkCollision(ball1)) {
        ballMid.velocity.x = -ballMid.velocity.x;
        ballMid.velocity.y = -ballMid.velocity.y;
        ball1.velocity.x = -ball1.velocity.x;
        ball1.velocity.y = -ball1.velocity.y;
    

        switch (kctLIB.getRandomInt(0, 3)) {
            case 0:
                ball1.changeState("seek");
                break;
            case 1:
                ball1.changeState("dash");
                break;
            case 2:
                ball1.changeState("guard");
                break;
        }
        switch (kctLIB.getRandomInt(0, 3)) {
            case 0:
                ballMid.changeState("seek");
                break;
            case 1:
                ballMid.changeState("dash");
                break;
            case 2:
                ballMid.changeState("guard");
                break;
        }
    }
    else {

        ball1.doAction(ballMid);
        ballMid.doAction(ball1);

    }

    ball1.update(ballMid);
    ballMid.update(ball1);

    ball1.checkEdges(canvasWidth, canvasHeight);
    ballMid.checkEdges(canvasWidth, canvasHeight);
    //console.log(`Velocity: ${ball1.velocity.x}, ${ball1.velocity.y}`)

    kctLIB.drawBall(ctx, ballMid);
    kctLIB.drawBall(ctx, ball1);

    velocityLabel.innerHTML = `ball1: ${ball1.velocity.x.toFixed(2)},${ball1.velocity.y.toFixed(2)}\nballMid: ${ballMid.velocity.x.toFixed(2)},${ballMid.velocity.y.toFixed(2)}\n`;

}

function updateBallSize(ball, otherBall) {
    return function (e) {
        ball.radius = parseInt(e.target.value, 10);

        if (ball.checkCollision(otherBall))
        {
            ball.position.x += ball.radius;
            ball.position.y += ball.radius;
        }
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