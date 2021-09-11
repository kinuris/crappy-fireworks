import { Acceleration } from "../types";
import { Point } from "./Point";

export class Rectangle extends Point {
    public dimensions

    constructor(position: Point, length: number, height: number) {
        super(position.x, position.y)

        this.dimensions = new Point(length, height)
    }

    setDimensions(length: number, height: number) {
        this.dimensions.x = length
        this.dimensions.y = height
    }
}