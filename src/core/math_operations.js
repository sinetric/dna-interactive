function clamp(num, max, min){
    return Math.min(Math.max(num, max), min)
}

export {
    clamp,
}