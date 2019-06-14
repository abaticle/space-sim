import { planet } from "../../svelte/stores.js";
import { get } from 'svelte/store';
import items from "../data/items";

export default class UISystem {

    constructor(ecs, actions) {
        this.ecs = ecs;
        this.actions = actions;
    }

    init() {

    }

    update(dt) {
        
        const actions = this.actions.getActions();

        actions.map(({ action, payload }, i) => {
            switch (action) {

                //Display right panel 
                case "displayPanel":

                    switch(payload.type) {
                        case "planet":
                            planet.set(this.getPlanet(payload.planetId));
                            break;

                        default:
                            throw new Error(`Unexepected envent ${action} / ${JSON.stringify(payload)}`);
                    }

                    
                    break;
                

                //Remove planet
                case "removePanel": 
                    planet.set(undefined);

                    this.actions.removeAction(i);
                    this.actions.removeAction("displayPanel")
                    break;
            }
        })

    }

    /**
     * Get planet informations
     * @param {number} planetId 
     */
    getPlanet(planetId) {

        let result = {
            id: planetId,
            x: this.ecs.get(planetId, "position", "x"),
            y: this.ecs.get(planetId, "position", "y"),
            desc: this.ecs.get(planetId, "planet", "desc"),
            owned: this.ecs.get(planetId, "planet", "owned"),
            buildings: [],
            items: []
        };

        //Planet buildings :
        this.ecs
            .searchEntities("building")
            .filter(id => this.ecs.get(id, "building", "planetId") === planetId)
            .forEach(buildingId => {
                const {
                    building,
                    extractor,
                    factory
                } = this.ecs.get(buildingId);


                let map = {
                    id: buildingId,
                    desc: building.desc
                }

                if (extractor) {
                    map = {
                        ...map,
                        workstep: extractor.workstep,
                        produce: extractor.resource === "" ? "": items[extractor.resource].desc,
                        time: extractor.time
                    }
                }

                if (factory) {
                    map = {
                        ...map,
                        workstep: factory.workstep,
                        produce: items[factory.produce].desc,
                        time: factory.time
                    }
                }

                result.buildings.push(map);
            })


        //Planet items
        Object
            .entries(this.ecs.get(planetId, "planet", "items"))
            .forEach(pair => {
                result.items.push({
                    id: pair[0],
                    desc: items[pair[0]].desc,
                    count: pair[1]
                })
            });

        return result;
    }

}
