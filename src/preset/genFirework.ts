import { Circle } from "../shapes/Circle";
import { Point } from "../shapes/Point";
import { Polygon } from "../shapes/Polygon";
import { Rectangle } from "../shapes/Rectangle";
import { animationLogic } from "../types";
import { clamp } from "../util/clamp";
import { Color } from "../util/Color";
import { Matrix2D } from "../util/Matrix";
import { getSizeCoefficient, getWindowArea } from "../util/windowArea";

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

    static genFirework2At(position: Point) {
        let output: Circle[] = []
        
        for(let u = 1; u < Math.ceil(Math.random() * 5) + 5; u++) {
            const color = Color.genRandColor(new Color(255, 255, 255, 1))
            const intensity = Math.random() * clamp(1800 * getSizeCoefficient(getWindowArea()), 600, 2500)
            const lifetime = Math.random() * 8 + 8
            const segments = Math.round(Math.random() * 32) + 8
            const radius = (Math.random() * 10) + 3

            for(let i = 0; i < segments; i++) {
                let fraction = 1/segments * i * Math.PI * 2
                let x = Math.cos(fraction) * intensity + position.x
                let y = Math.sin(fraction) * intensity + position.y
                let point = new Point(x, y)

                let distance = point.distance(position)
                let { x: xComponent, y: yComponent } = position.component(point)

                let velocity = new Point(xComponent * (distance/250), yComponent * (distance/250))

                output.push(new Circle(radius, position).setSteps(1).setLifetime(lifetime).setRadiusThreshold(0.2).setVelocity(velocity).setColor(color))
            } 
        }

        return output
    }

    static genFirework3At(position: Point) {
        let firework: Circle[] = []
        let shards: Polygon[] = []

        for(let u = 1; u < Math.ceil(Math.random() * 5) + 5; u++) {
            const color = Color.genRandColor(new Color(255, 255, 255, 1))
            const intensity = Math.random() * clamp(1800 * getSizeCoefficient(getWindowArea()), 600, 2500)
            const lifetime = Math.random() * 8 + 8
            const segments = Math.round(Math.random() * 32) + 8
            const radius = (Math.random() * 10) + 3

            for(let i = 0; i < segments; i++) {
                let fraction = 1/segments * i * Math.PI * 2
                let x = Math.cos(fraction) * intensity + position.x
                let y = Math.sin(fraction) * intensity + position.y
                let point = new Point(x, y)

                let distance = point.distance(position)
                let { x: xComponent, y: yComponent } = position.component(point)

                let velocity = new Point(xComponent * (distance/250), yComponent * (distance/250))

                firework.push(new Circle(radius, position).setSteps(1).setLifetime(lifetime).setRadiusThreshold(0.2).setVelocity(velocity).setColor(color))
            } 
        }

        const shardCount = Math.ceil(Math.random() * 6) + 4
        const intensity = Math.random() * clamp(800 * getSizeCoefficient(getWindowArea()), 600, 2500) + 500
        const relativeVertices = [new Point(-100, 0), new Point(-100, -100), new Point(0, -100)]

        for(let i = 0; i < shardCount; i++) {
            const color = Color.genRandColor(new Color(255, 255, 255, 1))
            const fraction = 1/shardCount * i * Math.PI * 2

            const x = Math.cos(fraction) * intensity + position.x
            const y = Math.sin(fraction) * intensity + position.y
            const point = new Point(x, y)

            const distance = point.distance(position)
            const { x: xComponent, y: yComponent } = position.component(point)

            const velocity = new Point(xComponent * (distance/150), yComponent * (distance/150))

            // shards.push(new Polygon(new Point(position.x, position.y))
            // .setLifetime(2)
            // .setVerticesRelative(relativeVertices)
            // .setColor(color)
            // .setVelocity(velocity)
            // .animate((ratio, tick) => Matrix2D.genIdentity().rotate(Math.sin(tick)).scale(0.1 * ratio), 20)
            // .animate((_, tick) => Matrix2D.genIdentity().rotate(Math.sin(tick/2) * 2 * Math.PI).scale(0.1), 20)
            // .animate((ratio, tick) => Matrix2D.genIdentity().rotate(Math.sin(tick)).scale(0.1 * (1 - ratio)), 20)
            // .setVirtualCenter(new Point(50, 50))
            // .enableTrails(0.18, 4))

            const animationLogic = {
                animations: 
                [
                    (ratio, tick) => Matrix2D.genIdentity().rotate(Math.sin(tick)).scale(0.1 * ratio),
                    (_, tick) => Matrix2D.genIdentity().rotate(Math.sin(tick/2) * 2 * Math.PI).scale(0.1),
                    (ratio, tick) => Matrix2D.genIdentity().rotate(Math.sin(tick)).scale(0.1 * (1 - ratio))
                ] as animationLogic[],
                durations: [20, 20, 20]
            }

            shards.push(Polygon.from(new Point(position.x, position.y), relativeVertices, color, velocity, new Point(0, 0), animationLogic, new Point(50, 50), { trailLifetime: 0.18, trailMaxLength: 4}, 2))
        }

        return { firework, shards }
    }

    static genFireworkWithin(bounds: Rectangle) {
        return this.genFireworkAt(bounds.getRandomPointWithin())
    }

    static genFirework2Within(bounds: Rectangle) {
        return this.genFirework2At(bounds.getRandomPointWithin())
    }
}