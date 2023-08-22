import { Point } from "../shapes/Point"

export class Matrix2D {

    private iHat = new Point(0, 0)
    private jHat = new Point(0, 0)

    static genIdentity() {
        return new Matrix2D(new Point(1, 0), new Point(0, 1))
    }

    constructor(firstColumn: Point, secondColumn: Point) {
        this.iHat = firstColumn
        this.jHat = secondColumn
    }

    multiply(point: Point) {
        let resultingX = this.iHat.multiply(point.x)
        let resultingY = this.jHat.multiply(point.y)
    
        return resultingX.add(resultingY)
    }

    scale(scalar: number) {
        this.iHat = this.iHat.multiply(scalar)
        this.jHat = this.jHat.multiply(scalar)

        return this
    }

    rotate(radians: number) {
        let x = Math.cos(radians)
        let y = Math.sin(radians)

        let xOffset = Math.cos(radians + Math.PI/2)
        let yOffset = Math.sin(radians + Math.PI/2)

        this.iHat = new Point(x, y)
        this.jHat = new Point(xOffset, yOffset)

        return this
    }
}