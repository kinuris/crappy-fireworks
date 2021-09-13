import "./style.sass"
import { Circle } from "./shapes/Circle"
import { Point } from "./shapes/Point"
import { Rectangle } from "./shapes/Rectangle"
import { fade } from "./util/fade"
import { Firework } from "./preset/genFirework"
import { Stars } from "./preset/genStars"
import { genTwilightGradient } from "./preset/twilightGradient"

const canvas = document.getElementById('cnv') as HTMLCanvasElement
const ctx = canvas.getContext('2d')

const header = document.getElementById('header') as HTMLHeadElement
let first = true

let fireworksArray: Circle[] = []
let starsArray: Circle[] = []
let shootingStarInterval: NodeJS.Timer, randomFireworkInterval: NodeJS.Timer, twinklingStars: NodeJS.Timer

window.addEventListener('load', () => {
    populateStars(500)
    startIntervals()
})

window.addEventListener('load', () => {
    applyWindowSize()
})

window.addEventListener('resize', () => {
    applyWindowSize()
    clearIntervals()
    starsArray = []
    populateStars(500)
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
        fireworksArray.push(...Firework.genFireworkWithin(new Rectangle(new Point(0.01 * window.innerWidth + 150, 200), 0.9 * window.innerWidth - 300, window.innerHeight/3)))
    }, 800)
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

    fireworksArray.push(...Firework.genFireworkAt(new Point(e.x, e.y)))
})

let bounds = new Rectangle(new Point(0, 0), window.innerWidth, window.innerHeight)
let startTime = Date.now()
let msPerUpdate = 1000/40
let twilightGradient = genTwilightGradient(ctx)

function animate() {
    let elapsed = Date.now()

    ctx.fillStyle = twilightGradient
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    // Updates as specified by msPerUpdate
    if(elapsed - startTime > msPerUpdate) {
        startTime = elapsed
        // Logic Here
        for(let i = 0; i < fireworksArray.length; i++) {
            if(fireworksArray[i].getRadius() > fireworksArray[i].getRadiusThreshold()) {
                fireworksArray[i].update(bounds)
            }
        }
    }

    // Animation Here
    for(let i = 0; i < fireworksArray.length; i++) {
        if(fireworksArray[i].getRadius() > 0) {
            fireworksArray[i].draw(ctx)
        }
    }

    for(let i = 0; i < starsArray.length; i++) {
        starsArray[i].draw(ctx)
    }

    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)