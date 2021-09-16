import "./style.sass"
import { Circle } from "./shapes/Circle"
import { Point } from "./shapes/Point"
import { Rectangle } from "./shapes/Rectangle"
import { fade } from "./util/fade"
import { Firework } from "./preset/genFirework"
import { Stars } from "./preset/genStars"
import { genTwilightGradient } from "./preset/twilightGradient"
import { getSizeCoefficient, getWindowArea } from "./util/windowArea"
import { clamp } from "./util/clamp"
import { Polygon } from "./shapes/Polygon"
import { Color } from "./util/Color"
import { Matrix2D } from "./util/Matrix"

const canvas = document.getElementById('cnv') as HTMLCanvasElement
const ctx = canvas.getContext('2d')

const header = document.getElementById('header') as HTMLHeadElement
let first = true

let fireworksArray: Circle[] = []
let starsArray: Circle[] = []
let polygonArray: Polygon[] = []
let shootingStarInterval: NodeJS.Timer, randomFireworkInterval: NodeJS.Timer, twinklingStars: NodeJS.Timer
let bounds = new Rectangle(new Point(0, 0), window.innerWidth, window.innerHeight)

window.addEventListener('load', () => {
    populateStars(clamp(500 * getSizeCoefficient(getWindowArea()), 100, 1000))
    startIntervals()
})

window.addEventListener('load', () => {
    applyWindowSize()
})

window.addEventListener('resize', () => {
    applyWindowSize()
    clearIntervals()
    starsArray = []
    populateStars(clamp(500 * getSizeCoefficient(getWindowArea()), 100, 1000))
    startIntervals()
})

window.addEventListener('visibilitychange', () => {
    if(document.hidden){
        clearIntervals()
    } else {
        startIntervals()
    }
})

window.addEventListener('close', () => {
    clearIntervals()
})
function applyWindowSize() {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
}
function populateStars(count: number) {
    starsArray.push(...Stars.genStars(new Rectangle(new Point(0.01 * window.innerWidth, 20), 0.99 * window.innerWidth, window.innerHeight), count))
}
function startIntervals() {
    shootingStarInterval = setInterval(() => {
        fireworksArray.push(...Stars.genShootingStar(new Rectangle(new Point(0.01 * window.innerWidth, 20), 0.9 * window.innerWidth, window.innerHeight/4)))
    }, 5000)
    randomFireworkInterval = setInterval(() => {
        fireworksArray.push(...Firework.genFirework2Within(new Rectangle(new Point(0.01 * window.innerWidth + 150, 200), 0.9 * window.innerWidth - 300, window.innerHeight/3)))
    }, 3000)
    twinklingStars = setInterval(() => {
        fireworksArray.push(Stars.twinklingStars(new Rectangle(new Point(0.01 * window.innerWidth, 20), 0.9 * window.innerWidth, window.innerHeight/2)))
    }, 2000)
}
function clearIntervals() {
    clearInterval(shootingStarInterval)
    clearInterval(randomFireworkInterval)
    clearInterval(twinklingStars)
}

canvas.addEventListener('click', e => {
    if(first){
        fade(header)
        first = !first
    }

    // let relativeVertices = [new Point(-100, 0), new Point(-50, -100)]
    // fireworksArray.push(...Firework.genFireworkAt(new Point(e.x, e.y)))
    // fireworksArray.push(...Firework.genFirework2At(new Point(e.x, e.y)))
    // polygonArray.push(new Polygon(new Point(e.x, e.y))
    // .setVerticesRelative(relativeVertices)
    // .setColor(Color.genRandColor(new Color(255, 255, 255, 1)))
    // .setVelocity(new Point(5, -6))
    // .setAcceleration(new Point(0, 0.2   ))
    // .animate((_, tick) => {
    //     return Matrix2D.genIdentity().rotate(Math.sin(tick)).scale(0.05)
    // }, 60)
    // .animate(ratio => Matrix2D.genIdentity().scale(0.05 * (ratio - 1)), 40)
    // .setLifetime(0)
    // .setVirtualCenter(new Point(50, 50))
    // .enableTrails(10, 10)
    // )

    let { firework, shards } = Firework.genFirework3At(new Point(e.x, e.y))
    fireworksArray.push(...firework)
    polygonArray.push(...shards)
})

let startTime = Date.now()
let msPerUpdate = 1000/40
let twilightGradient = genTwilightGradient(ctx)

function animate() {
    let elapsed = Date.now()

    ctx.fillStyle = twilightGradient
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    
    // Animation Here
    for(let i = 0; i < fireworksArray.length; i++) {
        if(fireworksArray[i].getRadius() > 0) {
            fireworksArray[i].draw(ctx)
        }
    }

    for(let i = 0; i < starsArray.length; i++) {
        starsArray[i].draw(ctx)
    }

    for(let i = 0; i < polygonArray.length; i++) {
        if(polygonArray[i].getLifetimeRatio()) {
            polygonArray[i].draw(ctx)
        } else {
            polygonArray.splice(i, 1)
        }
    }

    
    // Updates as specified by msPerUpdate
    if(elapsed - startTime > msPerUpdate) {
        startTime = elapsed
        
        // Logic Here
        for(let i = 0; i < fireworksArray.length; i++) {
            if(fireworksArray[i].getRadius() > fireworksArray[i].getRadiusThreshold()) {
                fireworksArray[i].update()
            }
        }

        for(let i = 0; i < polygonArray.length; i++) {
            polygonArray[i].update()
        }
    }

    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)
