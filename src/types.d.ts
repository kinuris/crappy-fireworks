import { Rectangle } from "./shapes/Rectangle";

export interface Acceleration {
    getXAccel(): number
    setXAccel(xAccel: number): void
    getYAccel(): number
    setYAccel(yAccel: number): void
}

export interface Velocity {
    getXVel(): number
    setXVel(xVel: number): void
    getYVel(): number
    setYVel(yVel: number): void
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
}

export interface Trail {
    enableTrails(trailLifetime: number, trailMaxLength: number, smoothTrail?: boolean): this
    disableTrails(): this
}