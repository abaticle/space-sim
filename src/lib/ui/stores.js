import { writable } from 'svelte/store';


export const speed = writable(1)

export const planet = writable(undefined)

export const spaceship = writable(undefined)

export const entityList = writable({
    visible: false,
    entities: []
})

export const chooseBuilding = writable({
    visible: false,
    planetId: undefined,
    buildings: []
})

export const chooseProduction = writable({
    visible: false,
    buildingId: undefined,
    items: []
})