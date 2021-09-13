
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
    private steps = 3
    private tick = 0
    private lifetime = 0
    private radiusThreshold = 0
    private changedY = false
    private changedX = false
    private collidedX: boolean
    private collidedY: boolean
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

        if(this.lifetime > 0) {
            this.tick++
            this.radius = this.radius * ((this.lifetime - this.tick)/this.lifetime)
        }
        
        if(boundingBox) {
            this.checkCollisions(boundingBox)
        }

        this.applyTrails()
        this.applyCollisions()
        this.applyVelocityAcceleration()
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
                this.applySteps()
                this.changedY = true
            }
        } else {
            this.changedY = false
        }

        if (this.collidedX) {
            if (this.collidedX && !this.changedX) {
                this.velocity.x = -this.velocity.x
                this.applySteps()
                this.changedX = true
            }
        } else {
            this.changedX = false
        }
    }

    private applyVelocityAcceleration() {
        // Apply Acceleration
        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y
        
        // Apply Velocity
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
    
    applySteps() {
        // Decreases Radius According to Steps
        if(this.steps < 1)
            return

        this.radius -= (this.radiusOriginal/this.steps)
    }

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
}