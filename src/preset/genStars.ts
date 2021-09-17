import { Circle } from "../shapes/Circle";
import { Point } from "../shapes/Point";
import { Rectangle } from "../shapes/Rectangle";
import { getSizeCoefficient, getWindowArea } from "../util/windowArea";

export class Stars {
    static genStars(boundingBox: Rectangle, count: number) {
        if(count < 1)
            throw new Error("INVALID COUNT")

        let output: Circle[] = []
        
        for(let i = 0; i < count; i++) {
            let radius = Math.random()

            let circle = new Circle(radius, boundingBox.getRandomPointWithin())
            output.push(circle)
        }

        return output
    }

    static genShootingStar(bounds: Rectangle) {
        let output: Circle[] = []
        
        // Select smaller Rectangle from Bounding Box
        let spawnerWidth = Math.random() * 50 + 100
        let spawnerHeight = Math.random() * 50 + 100
        let { x: xBound, y: yBound } = bounds.getDimensions()
        let shootingStarSpawner = new Rectangle(new Point(Math.random() * (xBound - spawnerWidth), Math.random() * (yBound - spawnerHeight)), spawnerWidth, spawnerHeight)
        
        for(let i = 0; i < Math.ceil(Math.random() * 3) + 1; i++) {
            let velocityMultiplier = 1 + Math.random() * getSizeCoefficient(getWindowArea())/2

            output.push(new Circle(3 * getSizeCoefficient(getWindowArea()), shootingStarSpawner.getRandomPointWithin())
            .enableTrails(1, 10, 1, true)
            .setSteps(1)
            .setLifetime(5)
            .setYAccel(0.05)
            .setVelocity(new Point(13 * velocityMultiplier, 5 * velocityMultiplier)))
        }

        return output
    }

    static twinklingStars(bounds: Rectangle) {
        return new Circle(3, bounds.getRandomPointWithin()).setLifetime(20)
    }
}