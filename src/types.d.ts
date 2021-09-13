import { Point } from "./shapes/Point";
import { Rectangle } from "./shapes/Rectangle";

export interface Acceleration {
    setAcceleration(accel: Point): this
    setXAccel(xAccel: number): this
    setYAccel(yAccel: number): this
    getXAccel(): number
    getYAccel(): number
}

export interface Velocity {
    setVelocity(vel: Point): this
    setXVel(xVel: number): this
    setYVel(yVel: number): this
    getXVel(): number
    getYVel(): number
}

export interface Updatable {
    update(boundingBox?: Rectangle): void
}

export interface Drawable {
    draw: (canvas: CanvasRenderingContext2D) => void
}

export interface Step {
    applySteps(): void
    setSteps(steps: number): this
    getSteps(): number
}

export interface Collisions {
    checkCollisions(boundingBox: Rectangle): void
    getCollidedX(): boolean
    getCollidedY(): boolean
}

export interface Trail {
    enableTrails(trailLifetime: number, trailMaxLength: number, smoothTrail?: boolean): this
    disableTrails(): this
}