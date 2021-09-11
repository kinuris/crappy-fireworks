import { Circle } from "../shapes/Circle";
import { Point } from "../shapes/Point";
import { Rectangle } from "../shapes/Rectangle";
import { Color } from "../util/Color";

export class Firework {
    static genFireworkAt(position: Point) {

        let output: Circle[] = []
        
        for(let u = 1; u < 8; u++) {
            const count = Math.random() * 20 + 20
            const color = Color.genRandColor(new Color(255, 255, 255, 1))
            const intensity = Math.random() * 1800

            for(let i = 0; i < count; i++) {
                let randomAngle = Math.random() * Math.PI * 2
                let x = (Math.cos(randomAngle)) * intensity + position.x
                let y = (Math.sin(randomAngle)) * intensity + position.y

                let randPoint = new Point(x, y)
                let { x: xComponent, y: yComponent } = position.component(randPoint)
                let distance = randPoint.distance(position)
                
                let radius = Math.random() * 10 + 2
                
                let acceleration = new Point(0, 0)
                let velocity = new Point(xComponent * (distance/250), yComponent * (distance/250))

                output.push(new Circle(radius, position, acceleration, velocity, 0.7, color).setSteps(1).setLifetime(10).setRadiusThreshold(0.2))
            } 
        }

        return output
    }

    static genFireworkWithin(bounds: Rectangle) {
        let x = bounds.x + (Math.random() * bounds.dimensions.x)
        let y = bounds.y + (Math.random() * bounds.dimensions.y)

        return this.genFireworkAt(new Point(x, y))
    }
}