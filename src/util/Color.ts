export class Color {

    r: number
    g: number
    b: number
    a: number

    constructor(red: number, green: number, blue: number, alpha: number) {
        this.r = red
        this.g = green
        this.b = blue
        this.a = alpha
    }

    public static genRandColor(mix?: Color) {
        let red = Math.random() * 255
        let green = Math.random() * 255
        let blue = Math.random() * 255

        if(mix) {
            red = (red + mix.r)/2
            blue = (blue + mix.b)/2
            green = (green + mix.g)/2
        }

        return new Color(red, green, blue, 1)
    }

    mix(mix: Color) {
        this.r = (this.r + mix.r)/2
        this.b = (this.b + mix.b)/2
        this.g = (this.g + mix.g)/2

        return this
    }

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }
}