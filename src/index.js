'use strict';
window.onload = init;

let canvas;
let ctx;

const canvasWidth = 600, canvasHeight = 400;

let ball1;
let ballMid;

let particle;

let paused;

let ball1SizeSlider;
let ball2SizeSlider;

let alphaSlider;
let alphaLabel;

let velocityLabel;
let attackLabel, dashLabel, guardLabel;
let attackSlider, dashSlider, guardSlider;
let attackWeight, dashWeight, guardWeight;


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

    alphaSlider.oninput = wsbLIB.updateLabel("#alphaLabel", "#alphaSlider");

    //ball1SizeSlider.oninput = updateLabel("#sizeLabel", "#sizeSlider");
    ball1SizeSlider.addEventListener("input", wsbLIB.updateLabel("#size1Label", "#size1Slider"));
    ball2SizeSlider.addEventListener("input", wsbLIB.updateLabel("#size2Label", "#size2Slider"));


    // for action weights
    initializeWeights();

    ball1 = new ball(100, 100, 25, "red");
    ballMid = new ball(canvasWidth / 2, canvasHeight / 2, 50, "black");

    particle = new singleParticle(ball1.position.x, ball1.position.y, 50, "blue", 5, 90);

    ball1SizeSlider.addEventListener("input", wsbLIB.updateBallSize(ball1, ballMid));
    ball2SizeSlider.addEventListener("input", wsbLIB.updateBallSize(ballMid, ball1));

    kctLIB.drawBall(ctx, ballMid);
    kctLIB.drawBall(ctx, ball1);

    wsbLIB.drawParticle(ctx, particle);

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
    
        getNewAction(ball1);
        getNewAction(ballMid);
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

function getNewAction (ball) {
    let randomNum = kctLIB.getRandomInt(0, attackWeight + dashWeight + guardWeight);
    console.log(randomNum);
    if(randomNum < attackWeight) {
        console.log("normal");
        ball.changeState("normal");
        return;
    }
    randomNum -= attackWeight;
    if(randomNum < dashWeight) {
        console.log("dash");
        ball.changeState("dash");
        return;
    }
    randomNum -= dashWeight;
    if(randomNum < guardWeight) {
        console.log("guard");
        ball.changeState("guard");
        return;
    }
    
    //default
    //ball.changeState("normal");
}
function updateLabel(labelName, controlName) {
    return function () {
        document.querySelector(labelName).innerHTML = document.querySelector(controlName).value;
    }
}

function  initializeWeights() {
    // attack
    attackSlider = document.querySelector("#attackSlider");
    attackWeight = parseInt(attackSlider.value, 10);
    document.querySelector("#attackLabel").innerHTML = `Attack: ${attackWeight}`;
    attackSlider.addEventListener("input", function(e){ document.querySelector("#attackLabel").innerHTML = `Attack: ${e.target.value}`;});
    attackSlider.addEventListener("input", function(e){ attackWeight = parseInt(attackSlider.value, 10);});
    
    // dash
    dashSlider = document.querySelector("#dashSlider");
    dashWeight = parseInt(dashSlider.value, 10);
    document.querySelector("#dashLabel").innerHTML = `Dash: ${dashWeight}`;
    dashSlider.addEventListener("input", function(e){ document.querySelector("#dashLabel").innerHTML = `Dash: ${e.target.value}`;});
    dashSlider.addEventListener("input", function(e){ dashWeight = parseInt(dashSlider.value, 10);});
    
    // guard
    guardSlider = document.querySelector("#guardSlider");
    guardWeight = parseInt(guardSlider.value, 10);
    document.querySelector("#guardLabel").innerHTML = `Guard: ${guardWeight}`;
    guardSlider.addEventListener("input", function(e){ document.querySelector("#guardLabel").innerHTML = `Guard: ${e.target.value}`;});
    guardSlider.addEventListener("input", function(e){ guardWeight = parseInt(guardSlider.value, 10);});
    
}


function cls(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}