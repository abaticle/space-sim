import { writable } from 'svelte/store';


export const speed = writable(1);

export const planet = writable(undefined);

export const chooseBuilding = writable({
    planetId: undefined,
    visible: false
})

export const chooseBuildingList = writable({
    planetId: undefined,
    buildings: []
})