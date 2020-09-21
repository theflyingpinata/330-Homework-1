console.log("loaded");

(function () {

    let kctLIB = {
        // handy helper functions!
        getRandomColor() {
            const getByte = _ => 55 + Math.round(Math.random() * 200);
            //return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",.8)";
            return `rgba(${getByte()},${getByte()},${getByte()},1)`;
        },

        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        drawRectangle(ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") {
            ctx.save();
            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.closePath();
            ctx.fill();
            if (lineWidth > 0) {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = strokeStyle;
                ctx.stroke();
            }
            ctx.restore();
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
        
        drawBall(ctx, ball){
            kctLIB.drawCircle(ctx, ball.position.x, ball.position.y, ball.radius, ball.color);
        },
        
        add2Vector(vector1, vector2) {
            return new vector(vector1.x + vector2.x, vector1.y + vector2.y);
        },

        sub2Vector(vector1, vector2) {
            return new vector(vector1.x - vector2.x, vector1.y - vector2.y);
        }

    };

    if (window) {
        window["kctLIB"] = kctLIB;
    }
    else {
        throw "'window' is not defined!";
    }

})();