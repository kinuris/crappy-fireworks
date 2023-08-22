import { Matrix2D } from "../util/Matrix"

export class Point {
    public xOriginal
    public yOriginal
    public x
    public y

    constructor(x: number, y: number) {
        this.xOriginal = this.x = x
        this.yOriginal = this.y = y
    }

    flip() {
        [this.x, this.y] = [this.y, this.x]
    }

    distance(point: Point) {
        let xDifference = this.x - point.x
        let yDifference = this.y - point.y

        return Math.hypot(xDifference, yDifference)
    }

    component(point: Point) {
        let distance = this.distance(point)

        return new Point((this.x - point.x)/distance, (this.y - point.y)/distance)
    }

    componentDifference(point: Point) {
        let xDistance = this.x - point.x
        let yDistance = this.y - point.y

        return new Point(xDistance, yDistance)
    }

    add(point: Point) {
        return new Point(this.x + point.x, this.y + point.y)
    }

    multiply(scalar: number) {
        return new Point(this.x * scalar, this.y * scalar)
    }

    transform(matrix: Matrix2D) {
        let { x, y } = matrix.multiply(new Point(this.xOriginal, this.yOriginal))
        this.x = x
        this.y = y

        return this
    }
}