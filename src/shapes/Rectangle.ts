import { Point } from "./Point";

export class Rectangle extends Point {
    private dimensions

    constructor(position: Point, length: number, height: number) {
        super(position.x, position.y)

        this.dimensions = new Point(length, height)
    }

    setDimensions(length: number, height: number) {
        this.dimensions.x = length
        this.dimensions.y = height
    }

    getDimensions() {
        return this.dimensions
    }

    getRandomPointWithin() {
        let x = this.x + (Math.random() * this.dimensions.x)
        let y = this.y + (Math.random() * this.dimensions.y)

        return new Point(x, y)
    }
}