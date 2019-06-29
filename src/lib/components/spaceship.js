
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
    speed: 500,
    mass: 5,
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

    //Take state
    takeFrom: 0,
    takeTime: 5,
    takeCurrentTime: 0,
    takeItems: {},

    //Give state
    giveTo: 0,
    giveTime: 5,
    giveCurrentTime: 0,
    giveItems: {},

}

export { spaceship, spaceshipState };