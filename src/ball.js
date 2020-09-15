class ball {
    constructor(x, y, radius, color) {
        this.position = new vector(x, y);
        this.radius = radius;
        this.color = color;

        this.acceleration = .1;
        this.maxSpeed = 4;
        this.velocity = new vector(0, 0);
    }

    update() {
        // let seekVector = this.seek(target);
        // seekVector.scale(this.acceleration);
        // this.velocity = kctLIB.add2Vector(seekVector, this.velocity); //kctLIB.add2Vector(, this.acceleration);
        this.clampVelocity();
        this.position = kctLIB.add2Vector(this.position, this.velocity);
    }

    clampVelocity() {
        let magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        console.log("magni " + magnitude);
        if (magnitude > this.maxSpeed) {
            this.velocity.normalize();
            this.velocity.scale(this.maxSpeed);
        }
    }

    seek(target) {
        let seekVector = kctLIB.sub2Vector(target.position, this.position);//new vector(target.position.x - this.position.x, target.position.y - this.position.y);
        seekVector.normalize();
        //seekVector.print();
        seekVector.scale(this.acceleration);
        this.velocity = kctLIB.add2Vector(seekVector, this.velocity);
    }

    checkEdges(width, height) {
        if(this.position.x > width) {
            this.velocity.x = -this.velocity.x;
        }
        if(this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if(this.position.y > height) {
            this.velocity.y = -this.velocity.y;
        }
        if(this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }
    }
}

class vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        let magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }

    scale(factor) {
        this.x *= factor;
        this.y *= factor;
    }

    print() {
        console.log(this.x + "," + this.y);
    }
}