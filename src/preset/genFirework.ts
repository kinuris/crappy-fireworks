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
            const lifetime = Math.random() * 8 + 8
            
            for(let i = 0; i < count; i++) {
                let randomAngle = Math.random() * Math.PI * 2
                let x = Math.cos(randomAngle) * intensity + position.x
                let y = Math.sin(randomAngle) * intensity + position.y
                let randPoint = new Point(x, y)
                
                let radius = Math.random() * 10 + 2
                let distance = randPoint.distance(position)

                let { x: xComponent, y: yComponent } = position.component(randPoint)
    
                let velocity = new Point(xComponent * (distance/250), yComponent * (distance/250))

                output.push(new Circle(radius, position).setSteps(1).setLifetime(lifetime).setRadiusThreshold(0.2).setVelocity(velocity).setColor(color))
            } 
        }

        return output
    }

    static genFireworkWithin(bounds: Rectangle) {
        return this.genFireworkAt(bounds.getRandomPointWithin())
    }
}