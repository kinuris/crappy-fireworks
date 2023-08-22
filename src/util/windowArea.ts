export function getWindowArea() {
    return window.innerHeight * window.innerWidth
}

export function getSizeCoefficient(size: number) {
    const standard = 1300 * 2560

    return size/standard
}