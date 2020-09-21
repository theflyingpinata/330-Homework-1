class singleParticle {
    constructor(x, y, radius, color, lifetime, angle) {
        this.position = new vector(x, y);
        this.radius = radius;
        this.color = color;
        this.lifetime = lifetime;
        this.alpha = 1;

        this.angle = angle * Math.PI / 180;

        this.acceleration = .1;
        this.maxSpeed = 2;
        this.velocity = new vector(0, 0);
        this.lifetimeDecay = 1;
    }

    update() {
        lifetime -= this.lifetimeDecay;

        if (this.lifetime > 0) {
            this.clampVelocity();
            this.position = kctLIB.add2Vector(this.position, this.velocity);
        }
    }

    seek(target) {
        let seekVector = kctLIB.sub2Vector(target.position, this.position);//new vector(target.position.x - this.position.x, target.position.y - this.position.y);
        seekVector.normalize();
        //seekVector.print();
        seekVector.scale(this.acceleration);
        this.velocity = kctLIB.add2Vector(seekVector, this.velocity);
    }

    clampVelocity() {
        let magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        //console.log("magni " + magnitude);
        if (magnitude > this.maxSpeed) {
            this.velocity.normalize();
            this.velocity.scale(this.maxSpeed);
        }
    }
}