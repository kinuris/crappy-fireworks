import { Point } from "../shapes/Point"
import { animationLogic } from "../types"

export class Animation {
    logic
    duration
    reversed
    tick = 0
    animationRatio = 0

    constructor(logic: animationLogic, duration: number, reversed = false) {
        this.logic = logic
        this.duration = duration
        this.reversed = reversed
    }

    update() {
        this.tick++
        this.applyAnimationRatio()

        return this.isDone()
    }

    animate(vertices: Point[]) {
        let transformMatrix = this.logic(this.animationRatio, this.tick)

        for(let i = 0; i < vertices.length; i++) {
            vertices[i].transform(transformMatrix)
        }

        return this.isDone()
    }

    isDone() {
        return this.animationRatio > 1
    }

    private applyAnimationRatio() {
        this.animationRatio = this.reversed ? (this.duration - this.tick)/this.duration : 1 - ((this.duration - this.tick)/this.duration)
    }
}