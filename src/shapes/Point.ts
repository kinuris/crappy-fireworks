export class Point {
    public x
    public y

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
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
}