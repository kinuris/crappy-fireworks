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

    static genShootingStar(boundingBox: Rectangle) {
        let output: Circle[] = []
        
        // Select smaller Rectangle from Bounding Box
        let spawnerWidth = Math.random() * 50 + 100
        let spawnerHeight = Math.random() * 50 + 100
        let shootingStarSpawner = new Rectangle(new Point(Math.random() * (boundingBox.dimensions.x - spawnerWidth), Math.random() * (boundingBox.dimensions.y - spawnerHeight)), spawnerWidth, spawnerHeight)
        
        for(let i = 0; i < Math.ceil(Math.random() * 3) + 1; i++) {
            let x = shootingStarSpawner.x + (Math.random() * shootingStarSpawner.dimensions.x)
            let y = shootingStarSpawner.y + (Math.random() * shootingStarSpawner.dimensions.y)
            let velocityMultiplier = 1 + Math.random()

            output.push(new Circle(3, new Point(x, y), new Point(0, 0), new Point(13 * velocityMultiplier, 5 * velocityMultiplier)).enableTrails(1, 10, true).setSteps(1).setLifetime(5))
        }

        return output
    }
}