
import { Drawable, Acceleration, Velocity, Updatable, Step, Collisions, Trail } from "../types";
import { Color } from "../util/Color";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
export class Circle extends Point implements Acceleration, Velocity, Drawable, Updatable, Step, Collisions, Trail {

    private radius
    private radiusOriginal
    private color
    private acceleration
    private velocity
    private bounce

    // 'steps' determine the percentage decremented on the radius per applyCollisions(), given that 'collidedX' or 'collidedY' are true
    // For example, steps = 3, result in three collisions before the radius is approximately 0, each collision decrementing the radius by 1/3 of the original radius
    private steps = 3

    // 'tick' is incremented every update() unless radius < 0
    private tick = 0

    // 'lifetime' depends on the value of 'tick', which controls the radius
    private lifetime = 0

    // 'radiusThreshold' determines at what point the circle stops getting processed because the radius is too small
    private radiusThreshold = 0

    // 'changedX' and 'changedY', along with 'collidedX' and 'collidedY' ensure that collisions are processed without clipping
    private changedY = false
    private changedX = false
    private collidedX: boolean
    private collidedY: boolean

    // The rest of the settings determine the 'trail'
    private hasTrail = false
    private trailLifetime: number
    private trailMaxLength: number
    private smoothTrails: boolean
    private trail: Circle[]

    constructor(radius: number, position: Point, acceleration = new Point(0, 0), velocity = new Point(0, 0), bounce = 0, color = new Color(255, 255, 255, 1)) {
        super(position.x, position.y)

        this.radiusOriginal = this.radius = radius
        this.color = color
        this.acceleration = acceleration
        this.velocity = velocity
        this.bounce = bounce
    }

    update(boundingBox?: Rectangle) {
        if(this.radius <= this.radiusThreshold)
            return

        if(this.lifetime > 0) 
            this.applyLifetime() 
        
        if(boundingBox) 
            this.checkCollisions(boundingBox)
        
        this.incrementTick()
        this.applyTrails()
        this.applyCollisions()
        this.applyVelocityAcceleration()
    }

    private incrementTick() {
        this.tick++
    }

    private applyLifetime() {
        this.radius = this.radius * ((this.lifetime - this.tick)/this.lifetime)
    }

    private applyTrails() {
        if(this.hasTrail && !this.smoothTrails) {
            if(this.trail.length > this.trailMaxLength)
                this.trail.shift()

            let circle = new Circle(this.radius, new Point(this.x, this.y))
            circle.setLifetime(this.trailLifetime)
            circle.setColor(this.color)

            this.trail.push(circle)

            for(let i = 0; i < this.trail.length; i++) {
                this.trail[i].update()
            }
        } 
    }

    private applyCollisions() {
        if (this.collidedY) {
            if (this.collidedY && !this.changedY) {
                this.velocity.y = -this.velocity.y * (this.bounce <= 0 ? 1 : this.bounce)
                this.changedY = true
                this.applySteps()
            }
        } else {
            this.changedY = false
        }

        if (this.collidedX) {
            if (this.collidedX && !this.changedX) {
                this.velocity.x = -this.velocity.x
                this.changedX = true
                this.applySteps()
            }
        } else {
            this.changedX = false
        }
    }

    private applyVelocityAcceleration() {

        // Applies Acceleration
        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y
        
        // Applies Velocity
        this.x += this.velocity.x
        this.y += this.velocity.y
    }

    draw(context: CanvasRenderingContext2D) {
        if(this.radius <= this.radiusThreshold)
            return

        // Draw on HTML Canvas
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
        context.fillStyle = this.color.toString()
        context.fill()

        if(this.hasTrail) {
            for(let i = 0; i < this.trail.length; i++) {
                console.log("drew ")
                this.trail[i].draw(context)
            }

            if(this.smoothTrails) {
                if(this.trail.length > this.trailMaxLength)
                this.trail.shift()

                let circle = new Circle(this.radius, new Point(this.x, this.y))
                circle.setLifetime(this.trailLifetime)
                circle.setColor(this.color)

                this.trail.push(circle)

                for(let i = 0; i < this.trail.length; i++) {
                    this.trail[i].update()
                }
            }
        }
    }

    getRandomPointWithin() {
        let randomAngle = Math.random() * 2 * Math.PI
        let randomX = (Math.cos(randomAngle) * this.radius * Math.random()) + this.x
        let randomY = (Math.sin(randomAngle) * this.radius * Math.random()) + this.y

        return new Point(randomX, randomY)
    }

    // Separated from logic that updates velocity values to ensure clipping does not occur
    checkCollisions(boundingBox: Rectangle) {
        if(this.radius <= this.radiusThreshold)
            return

        if (this.y + this.radius > boundingBox.dimensions.y) {
            this.collidedY = true
        } else {
            this.collidedY = false
        }

        if (this.x + this.radius > boundingBox.dimensions.x || this.x - this.radius < boundingBox.x) {
            this.collidedX = true
        } else {
            this.collidedX = false
        }
    }
    
    // Decreases Radius According to Steps
    applySteps() {
        if(this.steps < 1)
            return

        this.radius -= (this.radiusOriginal/this.steps)
    }

    // Initialization and setup of trails
    enableTrails(trailLifetime: number, trailMaxLength: number, smoothTrail = false) {
        this.trail = []
        this.hasTrail = true
        this.trailLifetime = trailLifetime
        this.trailMaxLength = trailMaxLength
        this.smoothTrails = smoothTrail

        return this
    }

    disableTrails() {
        this.trail = null
        this.hasTrail = false
        this.trailLifetime = null
        this.trailMaxLength = null
        this.smoothTrails = null

        return this
    }

    setRadiusThreshold(threshold: number) {
        this.radiusThreshold = threshold
        return this
    }

    setSteps(steps: number) {
        if(steps > 127)
            throw new Error("STEP COUNT TOO HIGH!")

        this.steps = Math.ceil(steps)
        return this
    }

    setLifetime(seconds: number) {
        this.lifetime = seconds * 40
        return this
    }

    setColor(color: Color) {
        this.color = color

        return this
    }

    getSteps() {
        return this.steps
    }

    setAcceleration(accel: Point) {
        this.acceleration = accel

        return this
    }

    setXAccel(xAccel: number) {
        this.acceleration.x = xAccel

        return this
    }

    setYAccel(yAccel: number) {
        this.acceleration.y = yAccel

        return this
    }

    getXAccel() {
        return this.acceleration.x
    }

    getYAccel() {
        return this.acceleration.y
    }

    setVelocity(vel: Point) {
        this.velocity = vel

        return this
    }

    setXVel(xVel: number) {
        this.velocity.x = xVel

        return this
    }

    setYVel(yVel: number) {
        this.velocity.y = yVel

        return this
    }

    getXVel() {
        return this.velocity.x
    }

    getYVel() {
        return this.velocity.y
    }

    getRadius() {
        return this.radius
    }

    getRadiusThreshold() {
        return this.radiusThreshold
    }
}