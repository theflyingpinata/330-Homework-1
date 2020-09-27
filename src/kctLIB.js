console.log("loaded kctLIB");

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

        drawStar(ctx, x, y, spikes, innerRadius = 5, outerRadius = 10, effectWidth = 5, startingRot = 0, innerFillStyle = "yellow", effectFillStyle = "red") {
            ctx.save();
            let rot = (Math.PI / 2 * 3);
            let tempx = x;
            let tempy = y;
            let step = Math.PI / spikes;

            rot += startingRot;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(rot) * outerRadius , y + Math.sin(rot) * outerRadius)
            // Draw each spike
            for (i = 0; i < spikes; i++) {
                tempx = x + Math.cos(rot) * outerRadius;
                tempy = y + Math.sin(rot) * outerRadius;
                ctx.lineTo(tempx, tempy)
                rot += step

                tempx = x + Math.cos(rot) * innerRadius;
                tempy = y + Math.sin(rot) * innerRadius;
                ctx.lineTo(tempx, tempy)
                rot += step
            }
            ctx.lineTo(x + Math.cos(rot) * outerRadius , y + Math.sin(rot) * outerRadius);
            ctx.closePath();
            ctx.lineWidth = effectWidth;
            ctx.strokeStyle = effectFillStyle;
            ctx.stroke();
            ctx.fillStyle = innerFillStyle;
            ctx.fill();
            ctx.restore();
        },

        drawBall(ctx, ball) {
            kctLIB.drawCircle(ctx, ball.position.x, ball.position.y, ball.radius, ball.color);
        },

        add2Vector(vector1, vector2) {
            return new vector(vector1.x + vector2.x, vector1.y + vector2.y);
        },

        sub2Vector(vector1, vector2) {
            return new vector(vector1.x - vector2.x, vector1.y - vector2.y);
        },

        getMidPoint(vector1, vector2) {
            return new vector((vector1.x + vector2.x) / 2, (vector1.y + vector2.y) / 2);
        }

    };

    if (window) {
        window["kctLIB"] = kctLIB;
    }
    else {
        throw "'window' is not defined!";
    }

})();