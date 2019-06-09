
/**
 * A spaceship can have multiple orders :
 * - goTo
 *      param: planetId (3)
 * - take
 *      param: object ({IronBar: 10})
 * - deposit 
 *      param: object ({IronBar: "all"})
 */

const spaceship = {
    name: "spaceship",
    desc: "",
    speed: 0,
    orderIndex: 0,
    orderRepeat: true,
    orders: [],
    items: {}
}

/**
 * Possible spaceship states are :
 * - orbit
 *      use: orbitAround
 * - move
 *      use: moveTo
 * - stop
 *      use: stopX, stopY
 * - transfer
 *      use: transferTo, transferTime, transferCurrent
 */
const spaceshipState = {
    name: "spaceshipState",
    state: "",
    orbitAround: 0,
    moveTo: 0,
    stopX: 0,
    stopY: 0,
    transferTo: 0,
    transferTime: 5,
    transferCurrent: 0
}

export { spaceship, spaceshipState };