console.log("loaded wsbLIB");

(function () {
    "use strict";

    let wsbLIB = {
        updateBallSize(ball, otherBall) {
            return function (e) {
                ball.radius = parseInt(e.target.value, 10);

                if (ball.checkCollision(otherBall)) {
                    ball.position.x += ball.radius;
                    ball.position.y += ball.radius;
                }
            }
        },

        updateBallColor(ball, state, color) {
            switch (state) {
                case "normal":
                    ball.normalColor = color;
                    break;
                case "guard":
                    ball.guardColor = color;
                    break;
                case "dash":
                    ball.dashColor = color;
                    break;
            }
        },

        updateLabel(labelName, controlName) {
            return function () {
                document.querySelector(labelName).innerHTML = document.querySelector(controlName).value;
            }
        },

        canvasClicked(e) {
            let rect = e.target.getBoundingClientRect();
            let mouseX = e.clientX - rect.x;
            let mouseY = e.clientY - rect.y;

            console.log(`${mouseX}, ${mouseY}`);

            return { mouseX, mouseY };
        },
    };

    if (window) {
        window["wsbLIB"] = wsbLIB;
    }
    else {
        throw "'window' is not defined!";
    }

})();