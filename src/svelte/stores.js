import { writable } from 'svelte/store';


export const speed = writable(1);

export const planet = writable(undefined);

export const chooseBuilding = writable({
    visible: false,
    planetId: undefined,
    buildings: []
})
