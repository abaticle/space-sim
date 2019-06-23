
/**
 * A spaceship can have multiple states :
 * - move
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
    stateIndex: 0,
    stateRepeat: true,
    states: [],
    items: {},
    owned: false
}

/**
 * Possible spaceship states
 */
const spaceshipState = {
    name: "spaceshipState",
    //state: "",
    
    //Orbit state 
    orbitAround: 0,
    
    //Move state
    moveTo: 0,
    
    //Stop state
    stopX: 0,
    stopY: 0,

    //Transfer state
    transferFrom: 0,
    transferTo: 0,
    transferTime: 5,
    transferCurrent: 0,
    transferItems: {}
}

export { spaceship, spaceshipState };