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
    };

    if (window) {
        window["wsbLIB"] = wsbLIB;
    }
    else {
        throw "'window' is not defined!";
    }

})();