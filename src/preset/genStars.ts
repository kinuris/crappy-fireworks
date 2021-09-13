import { Circle } from "../shapes/Circle";
import { Point } from "../shapes/Point";
import { Rectangle } from "../shapes/Rectangle";

export class Stars {
    static genStars(boundingBox: Rectangle, count: number) {
        if(count < 1)
            throw new Error("INVALID COUNT")

        let output: Circle[] = []
        
        for(let i = 0; i < count; i++) {
            let radius = Math.random()
            let x = boundingBox.x + (Math.random() * boundingBox.dimensions.x)
            let y = boundingBox.y + (Math.random() * boundingBox.dimensions.y)

            let circle = new Circle(radius, new Point(x, y))
            output.push(circle)
        }

        return output
    }

    static genShootingStar(bounds: Rectangle) {
        let output: Circle[] = []
        
        // Select smaller Rectangle from Bounding Box
        let spawnerWidth = Math.random() * 50 + 100
        let spawnerHeight = Math.random() * 50 + 100
        let shootingStarSpawner = new Rectangle(new Point(Math.random() * (bounds.dimensions.x - spawnerWidth), Math.random() * (bounds.dimensions.y - spawnerHeight)), spawnerWidth, spawnerHeight)
        
        for(let i = 0; i < Math.ceil(Math.random() * 3) + 1; i++) {
            let { x, y } = shootingStarSpawner.getRandomPointWithin()
            let velocityMultiplier = 1 + Math.random()

            output.push(new Circle(3, new Point(x, y))
            .enableTrails(1, 10, true)
            .setSteps(1)
            .setLifetime(5)
            .setYAccel(0.1)
            .setVelocity(new Point(13 * velocityMultiplier, 5 * velocityMultiplier)))
        }

        return output
    }

    static twinklingStars(bounds: Rectangle) {
        let { x, y } = bounds.getRandomPointWithin()

        return new Circle(3, new Point(x, y)).setLifetime(20)
    }
}