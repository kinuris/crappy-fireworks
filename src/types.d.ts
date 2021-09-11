import { Rectangle } from "./shapes/Rectangle";

export interface Acceleration {
    getXAccel(): number
    getYAccel(): number
}

export interface Velocity {
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
}

export interface Trail {
    enableTrails(trailLifetime: number, trailMaxLength: number, smoothTrail?: boolean): this
    disableTrails(): this
}