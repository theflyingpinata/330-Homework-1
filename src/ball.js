class ball {
    constructor(x, y, radius, color) {
        this.position = new vector(x, y);
        this.radius = radius;
        this.color = color;

        this.acceleration = .3;
        this.maxSpeed = 10;
        this.velocity = new vector(0, 0);
        this.state = "normal";
        this.stateTimer = 0;
    }

    update() {
        // let seekVector = this.seek(target);
        // seekVector.scale(this.acceleration);
        // this.velocity = kctLIB.add2Vector(seekVector, this.velocity); //kctLIB.add2Vector(, this.acceleration);
        this.clampVelocity();
        this.position.add(this.velocity);// = kctLIB.add2Vector(this.position, this.velocity);
    }


    doAction(target) {
        switch (this.state) {
            case "normal":
                this.velocity.add(this.seek(target));

                this.color = "red";

                break;
            case "dash":
                if (this.stateTimer >= 160) {
                    let seekVector = this.seek(target);
                    seekVector.scale(10);
                    this.velocity.add(seekVector);//= kctLIB.add2Vector(this.seek(target).scale(3), this.velocity);
                    this.color = "blue";
                }

                break;
            case "guard":
                if (this.stateTimer == 45) {
                    this.velocity.scale(.1);
                }
                else if (this.stateTimer >= 120) {
                    this.changeState("normal");
                }

                this.color = kctLIB.getRandomColor();

                break;
            default:
                this.velocity.add(this.seek(target));
                break;

        }
        this.stateTimer += 1;
    }

    changeState(newState) {
        this.stateTimer = 0;
        this.state = newState;
    }


    seek(target) {
        let seekVector = kctLIB.sub2Vector(target.position, this.position);//new vector(target.position.x - this.position.x, target.position.y - this.position.y);
        seekVector.normalize();
        //seekVector.print();
        seekVector.scale(this.acceleration);
        return seekVector;
        //this.velocity = kctLIB.add2Vector(seekVector, this.velocity);
    }

    checkEdges(width, height) {
        if (this.position.x + this.radius > width) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y + this.radius > height) {
            this.velocity.y = -this.velocity.y;
        }
        if (this.position.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }
    }

    clampVelocity() {
        let magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        //console.log("magni " + magnitude);
        if (magnitude > this.maxSpeed) {
            this.velocity.normalize();
            this.velocity.scale(this.maxSpeed);
        }
    }

    // returns true if this is colliding with given ball
    checkCollision(otherBall) {
        let distance = Math.pow(otherBall.position.x - this.position.x, 2) + Math.pow(otherBall.position.y - this.position.y, 2);
        let radiusDistance = Math.pow(this.radius + otherBall.radius, 2);
        if (distance < radiusDistance) {
            // Have a collision
            return true;
        }
        return false;
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

    add(otherVector) {
        this.x += otherVector.x;
        this.y += otherVector.y;
    }

    print() {
        console.log(this.x + "," + this.y);
    }
}