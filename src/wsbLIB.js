console.log("loaded wsbLIB");

(function () {
    "use strict";

    let wsbLIB = {
        setRadius(ball) {
            document.querySelector("sizeLabel").innerHTML = `Ball Size: ${ball.radius}`;
            this.ball.radius = this.value;
        },
    };

    if (window) {
        window["wsbLIB"] = wsbLIB;
    }
    else {
        throw "'window' is not defined!";
    }

})();