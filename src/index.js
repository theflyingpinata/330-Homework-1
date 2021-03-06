'use strict';
window.onload = init;

let canvas;
let ctx;
let canvasEffects, ctxEffects;

const canvasWidth = 600, canvasHeight = 600;

let ball1;
let ballMid;

let paused;

let ball1SizeSlider;
let ball2SizeSlider;
let currentBall;

let alphaDropdown;
let alphaLabel;

let velocityLabel;
let attackLabel, dashLabel, guardLabel;
let attackSlider, dashSlider, guardSlider;
let attackWeight, dashWeight, guardWeight;

let ball1Color;
let ballMidColor;
let HlevelGuard, SlevelGuard, LlevelGuard;
let HlevelNormal, SlevelNormal, LlevelNormal;
let HlevelDash, SlevelDash, LlevelDash;

let isMouseDown = false;

function init() {
    canvas = document.querySelector('#canvasMain');
    canvasEffects = document.querySelector('#canvasEffects');
    alphaDropdown = document.querySelector("#alphaDropdown");
    alphaLabel = document.querySelector("#alphaLabel");
    ball1SizeSlider = document.querySelector("#size1Slider");
    ball2SizeSlider = document.querySelector("#size2Slider");
    velocityLabel = document.querySelector("#velocityLabel");

    ball1Color = document.querySelector("#ball1Color");
    ballMidColor = document.querySelector("#ballMidColor");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvasEffects.width = canvasWidth;
    canvasEffects.height = canvasHeight;
    

    canvas.addEventListener("mousedown", toggleMouseDown);

    ctx = canvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    
    ctxEffects = canvasEffects.getContext('2d');

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
    
    document.querySelector("#resetButton").onclick = function () {
        setupBalls();
    };

    //alphaDropdown.onchange = wsbLIB.updateLabel("#alphaLabel", "#alphaDropdown");

    //ball1SizeSlider.oninput = updateLabel("#sizeLabel", "#sizeSlider");
    ball1SizeSlider.addEventListener("input", function(e) {document.querySelector("#size1Label").innerHTML = "Ball 1 Size: " + e.target.value});
    ball2SizeSlider.addEventListener("input", function(e){document.querySelector("#size2Label").innerHTML = "Ball 2 Size: " + e.target.value});


    // for action weights
    initializeWeights();

    colorSliderInit();

    setupBalls();

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
    ctx.globalAlpha = 1 / alphaDropdown.value;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    
    ctxEffects.save();
    ctxEffects.fillStyle = "white";
    ctxEffects.globalCompositeOperation = "source-atop";
    ctxEffects.globalAlpha = 1 / alphaDropdown.value;
    ctxEffects.fillRect(0, 0, canvasWidth, canvasHeight);
    ctxEffects.restore();

    if (ballMid.checkCollision(ball1)) {
        ballMid.velocity.x = -ballMid.velocity.x;
        ballMid.velocity.y = -ballMid.velocity.y;
        ball1.velocity.x = -ball1.velocity.x;
        ball1.velocity.y = -ball1.velocity.y;

        getNewAction(ball1);
        getNewAction(ballMid);

        // Clashing effects
        ctxEffects.save();
        ctxEffects.clearRect(0, 0, canvasWidth, canvasHeight);
        let collisionPoint = kctLIB.getMidPoint(ball1.position, ballMid.position);
        kctLIB.drawStar(ctxEffects, collisionPoint.x, collisionPoint.y, kctLIB.getRandomInt(4, 8), kctLIB.getRandomInt(12, 24), kctLIB.getRandomInt(24, 36), kctLIB.getRandomInt(5, 10), kctLIB.getRandomInt(0, 100), "red", "yellow");
    
        ctxEffects.restore();
    }
    else {

        if (!isMouseDown) {
            ball1.doAction(ballMid);
            ballMid.doAction(ball1);
        }
    }

    ball1.update(ballMid);
    ballMid.update(ball1);

    ball1.checkEdges(canvasWidth, canvasHeight);
    ballMid.checkEdges(canvasWidth, canvasHeight);

    kctLIB.drawBall(ctx, ballMid);
    kctLIB.drawCircle(ctx, ballMid.position.x, ballMid.position.y, 2, "white");

    kctLIB.drawBall(ctx, ball1);
    kctLIB.drawCircle(ctx, ball1.position.x, ball1.position.y, 2, "black");

}


function setupBalls() {
    ball1 = new ball(kctLIB.getRandomInt(0, canvasWidth / 2), kctLIB.getRandomInt(0, canvasHeight), parseInt(ball1SizeSlider.value, 10));
    ballMid = new ball(kctLIB.getRandomInt(canvasWidth / 2, canvasWidth), kctLIB.getRandomInt(0, canvasHeight), parseInt(ball2SizeSlider.value, 10));
    
    ball1SizeSlider.addEventListener("input", wsbLIB.updateBallSize(ball1, ballMid));
    ball2SizeSlider.addEventListener("input", wsbLIB.updateBallSize(ballMid, ball1));

    updateNormalColor();
    updateDashColor();
    updateGuardColor();

    ball1SizeSlider.addEventListener("input", wsbLIB.updateBallSize(ball1, ballMid));
    ball2SizeSlider.addEventListener("input", wsbLIB.updateBallSize(ballMid, ball1));
}

function getNewAction(ball) {
    let randomNum = kctLIB.getRandomInt(0, attackWeight + dashWeight + guardWeight);
    if (randomNum < attackWeight) {
        ball.changeState("normal");
        return;
    }
    randomNum -= attackWeight;
    if (randomNum < dashWeight) {
        ball.changeState("dash");
        return;
    }
    randomNum -= dashWeight;
    if (randomNum < guardWeight) {
        ball.changeState("guard");
        return;
    }
}

function updateLabel(labelName, controlName) {
    return function () {
        document.querySelector(labelName).innerHTML = document.querySelector(controlName).value;
    }
}

function initializeWeights() {
    // attack
    attackSlider = document.querySelector("#attackSlider");
    attackWeight = parseInt(attackSlider.value, 10);
    document.querySelector("#attackLabel").innerHTML = `Attack: ${attackWeight}`;
    attackSlider.addEventListener("input", function (e) { document.querySelector("#attackLabel").innerHTML = `Attack: ${e.target.value}`; });
    attackSlider.addEventListener("input", function (e) { attackWeight = parseInt(attackSlider.value, 10); });

    // dash
    dashSlider = document.querySelector("#dashSlider");
    dashWeight = parseInt(dashSlider.value, 10);
    document.querySelector("#dashLabel").innerHTML = `Dash: ${dashWeight}`;
    dashSlider.addEventListener("input", function (e) { document.querySelector("#dashLabel").innerHTML = `Dash: ${e.target.value}`; });
    dashSlider.addEventListener("input", function (e) { dashWeight = parseInt(dashSlider.value, 10); });

    // guard
    guardSlider = document.querySelector("#guardSlider");
    guardWeight = parseInt(guardSlider.value, 10);
    document.querySelector("#guardLabel").innerHTML = `Guard: ${guardWeight}`;
    guardSlider.addEventListener("input", function (e) { document.querySelector("#guardLabel").innerHTML = `Guard: ${e.target.value}`; });
    guardSlider.addEventListener("input", function (e) { guardWeight = parseInt(guardSlider.value, 10); });

}

function toggleMouseDown(e) {
    isMouseDown = !isMouseDown;
}

function cls(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

// This will initialize the sliders for the color of the balls
function colorSliderInit() {
    HlevelGuard = document.querySelector("#HlevelGuard");
    SlevelGuard = document.querySelector("#SlevelGuard");
    LlevelGuard = document.querySelector("#LlevelGuard");

    HlevelNormal = document.querySelector("#HlevelNormal");
    SlevelNormal = document.querySelector("#SlevelNormal");
    LlevelNormal = document.querySelector("#LlevelNormal");

    HlevelDash = document.querySelector("#HlevelDash");
    SlevelDash = document.querySelector("#SlevelDash");
    LlevelDash = document.querySelector("#LlevelDash");

    HlevelNormal.addEventListener("input", updateNormalColor);
    SlevelNormal.addEventListener("input", updateNormalColor);
    LlevelNormal.addEventListener("input", updateNormalColor);
    
    HlevelDash.addEventListener("input", updateDashColor);
    SlevelDash.addEventListener("input", updateDashColor);
    LlevelDash.addEventListener("input", updateDashColor);
    
    HlevelGuard.addEventListener("input", updateGuardColor);
    SlevelGuard.addEventListener("input", updateGuardColor);
    LlevelGuard.addEventListener("input", updateGuardColor);
}

// Helper functions for changing color of balls
function updateNormalColor() {
    let color = `hsl(${parseInt(HlevelNormal.value)}, ${parseInt(SlevelNormal.value)}%, ${parseInt(LlevelNormal.value)}%)`;
    wsbLIB.updateBallColor(ball1, "normal", color);
    wsbLIB.updateBallColor(ballMid, "normal", color);
}
function updateDashColor() {
    let color = `hsl(${parseInt(HlevelDash.value)}, ${parseInt(SlevelDash.value)}%, ${parseInt(LlevelDash.value)}%)`;
    wsbLIB.updateBallColor(ball1, "dash", color);
    wsbLIB.updateBallColor(ballMid, "dash", color);
}
function updateGuardColor() {
    let color = `hsl(${parseInt(HlevelGuard.value)}, ${parseInt(SlevelGuard.value)}%, ${parseInt(LlevelGuard.value)}%)`;
    wsbLIB.updateBallColor(ball1, "guard", color);
    wsbLIB.updateBallColor(ballMid, "guard", color);
}
