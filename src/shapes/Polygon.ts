import { Acceleration, animationLogic, Drawable, Step, Trail, Updatable, Velocity } from "../types";
import { Animation } from "../util/Animation";
import { clamp } from "../util/clamp";
import { Color } from "../util/Color";
import { Matrix2D } from "../util/Matrix";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

export class Polygon extends Point implements Acceleration, Velocity, Updatable, Drawable, Step, Trail {

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

    private trailLifetime: number
    private trailMaxLength: number
    private smoothTrails: boolean
    private trail: Polygon[]

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

            for(let i = 0; i < this.vertices.length; i++) {
                context.lineTo(this.vertices[i].x + (this.absolute ? 0 : this.x), this.vertices[i].y + (this.absolute ? 0 : this.y))
            }
        } else {
            // Emitter Animation
            this.applyAnimations()
            context.moveTo(this.vertices[0].x + this.virtualCenter.x, this.vertices[0].y + this.virtualCenter.y)
            for(let i = 1; i < this.vertices.length; i++) {
                context.lineTo(this.vertices[i].x + this.virtualCenter.x, this.vertices[i].y + this.virtualCenter.y)
            }
        }

        context.closePath()
        context.fill()

        if(this.trail) {
            for(let i = 0; i < this.trail.length; i++) {
                this.trail[i].draw(context)
            }
        }

        if(this.smoothTrails && this.trail)
            this.applyTrails()
    }

    update(boundingBox?: Rectangle) {
        if(this.lifetimeRatio < 0)
            return

        if(!this.smoothTrails && this.trail)
            this.applyTrails()

        this.incrementTick()
        this.applyVelocityAcceleration()
        this.applyLifetime()
        this.updateAnimations()

        if(boundingBox) {
            // TODO: Handle Collisions
        }
    }

    private applyTrails() {
        if(this.trail.length > this.trailMaxLength)
            this.trail.shift()

        let poly = new Polygon(this.virtualCenter)
        .setVerticesRelative(this.vertices)
        .setColor(this.color)
        .setLifetime(this.trailLifetime)
        .setVirtualCenter(new Point(0, 0))
        .popVertices()
        .animate(animationRatio => Matrix2D.genIdentity().scale(1 - animationRatio), this.trailLifetime)

        this.trail.push(poly)

        for(let i = this.trail.length - 1; i >= 0; i--) {
            this.trail[i].update()
            console.log(this.trail[i].getVertices())
        }
    }

    private updateAnimations() {
        if(!this.animations)
            return

        for(let i = 0; i < this.animations.length; i++) {
            if(!this.animations[i].update())
                break
            
            this.animations.splice(i, 1)
        }
    }

    /**
     * @remarks Updates vertices to reflect animation
     */
    private applyAnimations() {
        if(!this.animations)
            return

        for(let i = 0; i < this.animations.length; i++) {
            if(!this.animations[i].animate(this.vertices))
                break

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
        
        let output: Point[] = []
        for(let i = 0; i < this.vertices.length; i++) {
            output.push(center.componentDifference(this.vertices[i].multiply(-1)))
        }

        this.vertices = output

        // this.vertices = this.vertices.map(vertex => {
        //     return center.componentDifference(vertex.multiply(-1))
        // })

        this.vertices.push(center)

        return this
    }

    enableTrails(trailLifetime: number, trailMaxLength: number, smoothTrails = false) {
        this.trail = []
        this.trailLifetime = trailLifetime
        this.trailMaxLength = trailMaxLength
        this.smoothTrails = smoothTrails

        return this
    }

    disableTrails() {
        this.trail = null
        this.trailLifetime = null
        this.trailMaxLength = null
        this.smoothTrails = null

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

    popVertices() {
        this.vertices.pop()

        return this
    }

    getVertices() {
        return this.vertices
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