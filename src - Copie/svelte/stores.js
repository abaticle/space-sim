import { writable } from 'svelte/store';


export const planet = writable(undefined);

export const chooseBuilding = writable({
    planetId: undefined,
    visible: false
})

export const chooseBuildingList = writable({
    planetId: undefined,
    buildings: []
})