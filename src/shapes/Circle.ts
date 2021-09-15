
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
    
    /**
     * @private On every applyCollisions, velocity.y is multiplied by 'bounce'
     */
    private bounce

    /**
     * @private 'steps' determine the percentage decremented on the radius per applyCollisions(), given that 'collidedX' or 'collidedY' are true
     * For example, steps = 3, result in three collisions before the radius is approximately 0, each collision decrementing the radius by 1/3 of the original radius
     */
    private steps = 3

    // 'tick' is incremented every update() unless radius < 0
    private tick = 0

    // 'lifetime' depends on the value of 'tick' which, in turn, controls the radius
    private lifetime = 0

    // 'radiusThreshold' determines at what point the circle stops getting processed because the radius is too small
    private radiusThreshold = 0

    // allows for the separation of collision checking and application
    private separatedCollisionLogic = false

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

    /**
     * @remarks extends Point class
     * @param radius radius of the circle
     * @param position instance of Point class, specifies x and y coordinate
     * @param acceleration instance of Point class, specifies x acceleration and y acceleration
     * @setters setXAccel, setYAccel, setAcceleration
     * @default acceleration = new Point(0, 0)
     * @param velocity instance of Point class, specifies x velocity and y velocity
     * @setters setXVel, setYVel, setVelocity
     * @default velocity = new Point(0, 0)
     * @param bounce on every collision application, velocity.y is multiplied with bounce
     * @setters setBounce
     * @default bounce = 0
     * @param color instance of Color class in @link src/util/Color.ts
     * @setters setColor
     * @default color = new Color(0, 0, 0)
     */
    constructor(radius: number, position: Point, acceleration = new Point(0, 0), velocity = new Point(0, 0), bounce = 0, color = new Color(255, 255, 255, 1)) {
        super(position.x, position.y)

        this.radiusOriginal = this.radius = radius
        this.color = color
        this.acceleration = acceleration
        this.velocity = velocity
        this.bounce = bounce
    }

    /**
     * @param boundingBox - bounds where collisions are checked against.
     * 
     * @instructions
     * - If boundingBox is not provided, no collision-checking will be done.
     * - If enableSeparateCollisionLogic was called then you must call checkCollisions and applyCollisions manually
     */
    update(boundingBox?: Rectangle) {
        if(this.radius <= this.radiusThreshold)
            return

        if(this.lifetime > 0) 
            this.applyLifetime() 
            
        this.incrementTick()
        this.applyTrails()
        
        if(!this.separatedCollisionLogic) {
            if(boundingBox) 
                this.checkCollisionsPrivate(boundingBox)
            this.applyCollisionsPrivate()
        }

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

    private applyVelocityAcceleration() {

        // Applies Acceleration
        this.velocity = this.velocity.add(this.acceleration)

        // Applies Velocity
        this.x += this.velocity.x
        this.y += this.velocity.y
    }

    private applyCollisionsPrivate() {
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

    // Separate from logic that updates velocity values to ensure clipping does not occur
    // This method is not private to allow for collision checking separate of updates
    private checkCollisionsPrivate(boundingBox: Rectangle) {
        if(this.radius <= this.radiusThreshold)
            return

        let { x: xBound, y: yBound } = boundingBox.getDimensions()
        if (this.y + this.radius > yBound) {
            this.collidedY = true
        } else {
            this.collidedY = false
        }

        if (this.x + this.radius > xBound || this.x - this.radius < boundingBox.x) {
            this.collidedX = true
        } else {
            this.collidedX = false
        }
    }

    checkCollisions(boundingBox: Rectangle) {
        if(this.separatedCollisionLogic) {
            this.checkCollisionsPrivate(boundingBox)
        } else {
            throw new Error('Only call checkCollisions manually if enableSeparateCollisionLogic was called first')
        }
    }

    applyCollisions() {
        if(this.separatedCollisionLogic) {
            this.applyCollisionsPrivate()
        } else {
            throw new Error('Only call applyCollisions manually if enableSeparateCollisionLogic was called first')
        }
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
                this.trail[i].draw(context)
            }

            // Trail logic is moved here when smoothTrails are enabled
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

    enableSeparateCollisionLogic() {
        this.separatedCollisionLogic = true

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

    getCollidedX() {
        return this.collidedX
    }

    getCollidedY() {
        return this.collidedY
    }

    setBounce(bounce: number) {
        this.bounce = bounce

        return this
    }

    getBounce() {
        return this.bounce
    }
}