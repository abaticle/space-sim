import { writable } from 'svelte/store';

export const performances = writable({})

export const screen = writable("game")

export const debug = writable({
    data: ""
})


/**
 * Game speed 
 */
export const speed = writable(1)

/**
 * id: planet id
 * x
 * y
 * desc
 * owned 
 * construction[]
 *  - workstep
 *  - time
 * buildings[]
 *  - canProduce
 *  - workstep
 *  - produce
 *  - time
 * items[]
 *  - id
 *  - desc
 *  - type
 *  - count
 */
export const planet = writable(undefined)

/**
 * id: spaceship id
 */
export const spaceship = writable(undefined)


/**
 * visible ?
 * entities: []
 *  - type: planet/spaceship ?
 *  - desc
 *  - owned ?
 */
export const entityList = writable({
    visible: false,
    entities: []
})

/**
 * visible ?
 * planetId
 * buildings[]
 *  - items data...
 *  - canConstruct ?
 */
export const chooseBuilding = writable({
    visible: false,
    planetId: undefined,
    buildings: []
})

/**
 * visible ?
 * buildingId
 * items[]
 *  - items data...
 */
export const chooseProduction = writable({
    visible: false,
    buildingId: undefined,
    items: []
})