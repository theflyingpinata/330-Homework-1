console.log("loaded wsbLIB");

(function () {
    "use strict";

    let wsbLIB = {
        updateBallSize(ball, otherBall) {
            return function (e) {
                ball.radius = parseInt(e.target.value, 10);
        
                if (ball.checkCollision(otherBall))
                {
                    ball.position.x += ball.radius;
                    ball.position.y += ball.radius;
                }
            }
        },
        
        updateLabel(labelName, controlName) {
            return function () {
                document.querySelector(labelName).innerHTML = document.querySelector(controlName).value;
            }
        },

        drawCircle(ctx, x, y, radius, fillStyle = "black", lineWidth = 0, strokeStyle = "black") {
            ctx.save();
            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.arc(x, y, radius, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            if (lineWidth > 0) {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = strokeStyle;
                ctx.stroke();
            }
            ctx.restore();
        },

        drawParticle(ctx, particle) {
            wsbLIB.drawCircle(ctx, particle.position.x, particle.position.y, particle.radius, particle.color);
        },
    };

    if (window) {
        window["wsbLIB"] = wsbLIB;
    }
    else {
        throw "'window' is not defined!";
    }

})();