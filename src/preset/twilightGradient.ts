import { Color } from "../util/Color"

export function genTwilightGradient(ctx: CanvasRenderingContext2D) {
    let twilightGradient = ctx.createLinearGradient(window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight * 1.4)
    
    twilightGradient.addColorStop(0, new Color(0, 0, 0, 1).toString())
    twilightGradient.addColorStop(0.66, new Color(9, 15, 45, 1).toString())
    twilightGradient.addColorStop(1, new Color(180, 50, 40, 1).toString())

    return twilightGradient
}
