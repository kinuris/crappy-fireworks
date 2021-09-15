import { Acceleration, animationLogic, Drawable, Step, Updatable, Velocity } from "../types";
import { Animation } from "../util/Animation";
import { Color } from "../util/Color";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

export class Polygon extends Point implements Acceleration, Velocity, Updatable, Drawable, Step {

    private vertices: Point[]
    private animations: Animation[] = []
    private color = new Color(255, 255, 255, 1)
    private acceleration = new Point(0, 0)
    private velocity = new Point(0, 0)
    private virtualCenter: Point
    private tick = 0
    private lifetime = 0
    private lifetimeRatio = 1
    private steps = 0
    private absolute = false

    constructor(position: Point) {
        super(position.x, position.y)
    }

    draw(context: CanvasRenderingContext2D) {
        if(this.lifetimeRatio < 0)
            return

        context.beginPath()
        context.fillStyle = this.color.toString()

        if(!this.virtualCenter) {
            context.moveTo(this.x, this.y)
            this.applyAnimations() 
    
            if(this.absolute) {
                for(let i = 0; i < this.vertices.length; i++) {
                    context.lineTo(this.vertices[i].x, this.vertices[i].y)
                }
            } else {
                for(let i = 0; i < this.vertices.length; i++) {
                    context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y)
                }
            }
        } else {
            this.applyAnimations()
            context.moveTo(this.vertices[0].x + this.virtualCenter.x, this.vertices[0].y + this.virtualCenter.y)
            for(let i = 1; i < this.vertices.length; i++) {
                context.lineTo(this.vertices[i].x + this.virtualCenter.x, this.vertices[i].y + this.virtualCenter.y)
            }
        }

        context.closePath()
        context.fill()
    }

    update(boundingBox?: Rectangle) {
        if(this.lifetimeRatio < 0)
            return

        this.incrementTick()
        this.applyVelocityAcceleration()
        this.applyLifetime()
        this.updateAnimations()

        if(boundingBox) {
            // TODO: Handle Collisions
        }
    }

    private updateAnimations() {
        if(!this.animations)
            return

        for(let i = 0; i < this.animations.length; i++) {
            if(!this.animations[i].isDone()) {
                this.animations[i].update()

                break
            }
        }
    }

    /**
     * @remarks Updates vertices to reflect animation
     */
    private applyAnimations() {
        if(!this.animations)
            return

        for(let i = 0; i < this.animations.length; i++) {
            if(!this.animations[i].isDone()) {
                this.animations[i].animate(this.vertices)

                break
            }

            this.animations.splice(i, 1)
        }           
    }

    private applyLifetime() {
        if(this.lifetime < 1)
            return
        this.lifetimeRatio = ((this.lifetime - this.tick)/this.lifetime)
    }

    private applyVelocityAcceleration() {
        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y

        this.x += this.velocity.x
        this.y += this.velocity.y

        if(this.absolute) {
            for(let i = 0; i < this.vertices.length; i++) {
                this.vertices[i].x += this.velocity.x
                this.vertices[i].y += this.velocity.y
            }
        }
    }

    private incrementTick() {
        this.tick++
    }

    animate(transformation: animationLogic, duration: number) {
        this.animations.push(new Animation(transformation, duration))
      
        return this
    }

    setVirtualCenter(center: Point) {
        this.virtualCenter = this

        this.vertices = this.vertices.map(vertex => {
            return center.componentDifference(vertex.multiply(-1))
        })

        this.vertices.push(center)

        return this
    }

    toggleVerticesAbsolute() {
        this.absolute = !this.absolute

        return this
    }

    setVerticesRelative(vertices: Point[]) {
        this.vertices = vertices

        return this
    }

    setVertices(vertices: Point[]) {
        this.vertices = []

        for(let i = 0; i < vertices.length; i++) {
            vertices[i].x += this.x
            vertices[i].y += this.y

            this.vertices.push(vertices[i])
        }

        return this
    }

    addVertices(vertices: Point[]) {
        this.vertices.push(...vertices)
        
        return this
    }

    setLifetime(lifetime: number) {
        this.lifetime = lifetime

        return this
    }

    getLifetime() {
        return this.lifetime
    }

    getLifetimeRatio() {
        return this.lifetimeRatio
    }

    setColor(color: Color) {
        this.color = color

        return this
    }

    // TODO: applySteps
    applySteps() {
        if(this.steps < 1)
            return
    }

    setSteps(steps: number) {
        this.steps = steps

        return this
    }

    getSteps() {
        return this.steps
    }
    
    setAcceleration(acceleration: Point) {
        this.acceleration = acceleration
        
        return this
    }

    setYAccel(yAccel: number) {
        this.acceleration.y = yAccel

        return this
    }

    getYAccel() {
        return this.acceleration.y
    }

    setXAccel(xAccel: number) {
        this.acceleration.x = xAccel

        return this
    }

    getXAccel() {
        return this.acceleration.x
    }

    setVelocity(velocity: Point) {
        this.velocity = velocity

        return this
    }

    setYVel(yVel: number) {
        this.velocity.y = yVel

        return this
    }

    getYVel() {
        return this.velocity.y
    }

    setXVel(xVel: number ) {
        this.velocity.x = xVel

        return this
    }

    getXVel() {
        return this.velocity.x
    }
}