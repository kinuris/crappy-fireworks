import "./style.sass"
import { Circle } from "./shapes/Circle"
import { Point } from "./shapes/Point"
import { Rectangle } from "./shapes/Rectangle"
import { fade } from "./util/fade"
import { Firework } from "./preset/genFirework"
import { Color } from "./util/Color"
import { Stars } from "./preset/genStars"

const canvas = document.getElementById('cnv') as HTMLCanvasElement
const ctx = canvas.getContext('2d')

window.addEventListener('load', () => {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
})

window.addEventListener('resize', () => {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
})

const header = document.getElementById('header') as HTMLHeadElement
let first = true

let fireworksArray: Circle[] = []
let shootingStarInterval: NodeJS.Timer, randomFireworkInterval: NodeJS.Timer
window.addEventListener('load', e => {
    fireworksArray.push(...Stars.genStars(new Rectangle(new Point(0.01 * window.innerWidth, 20), 0.99 * window.innerWidth, window.innerHeight), 500))
    shootingStarInterval = setInterval(() => {
        fireworksArray.push(...Stars.genShootingStar(new Rectangle(new Point(0.01 * window.innerWidth, 20), 0.9 * window.innerWidth, window.innerHeight/4)))
    }, 5000)

    randomFireworkInterval = setInterval(() => {
        fireworksArray.push(...Firework.genFireworkWithin(new Rectangle(new Point(0.01 * window.innerWidth, 200), 0.9 * window.innerWidth, window.innerHeight/3)))
    }, 755)

})

document.addEventListener('visibilitychange', () => {
    if(document.hidden){
        clearInterval(shootingStarInterval)
        clearInterval(randomFireworkInterval)
    } else {
        shootingStarInterval = setInterval(() => {
            fireworksArray.push(...Stars.genShootingStar(new Rectangle(new Point(0.01 * window.innerWidth, 20), 0.9 * window.innerWidth, window.innerHeight/4)))
        }, 5000)
    
        randomFireworkInterval = setInterval(() => {
            fireworksArray.push(...Firework.genFireworkWithin(new Rectangle(new Point(0.01 * window.innerWidth + 150, 200), 0.9 * window.innerWidth - 300, window.innerHeight/3)))
        }, 800)
    }
})

window.addEventListener('close', () => {
    clearInterval(shootingStarInterval)
    clearInterval(randomFireworkInterval)
})

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
function animate() {
    let elapsed = Date.now()

    let twilightGradient = ctx.createLinearGradient(window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight * 1.4)
    twilightGradient.addColorStop(0, new Color(0, 0, 0, 1).toString())
    twilightGradient.addColorStop(0.66, new Color(9, 15, 45, 1).toString())
    twilightGradient.addColorStop(1, new Color(180, 50, 40, 1).toString())

    ctx.fillStyle = twilightGradient
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    if (elapsed - startTime > msPerUpdate) {
        startTime = elapsed

        // TODO: Put Logic Here

        for(let i = 0; i < fireworksArray.length; i++) {
            fireworksArray[i].update(bounds)
        }
    }

    // TODO: Put Animation Here
    
    for(let i = 0; i < fireworksArray.length; i++) {
        fireworksArray[i].draw(ctx)
    }

    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)