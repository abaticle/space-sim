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

        const { planet, position } = this.ecs.get(planetId);

        let result = {
            id: planetId,
            x: position.x,
            y: planet.y,
            desc: planet.desc,
            owned: planet.owned,
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
                    producer
                } = this.ecs.get(buildingId);


                let map = {
                    id: buildingId,
                    desc: building.desc
                }

                if (producer) {
                    const item = items[producer.produce];

                    map = {
                        ...map,
                        workstep: producer.workstep,
                        produce: producer.produce === "" ? "": item.desc,
                        time: item.time
                    }
                }

                result.buildings.push(map);
            })


        //Planet items
        Object
            .entries(this.ecs.get(planetId, "planet", "items"))
            .forEach(pair => {
                const item = items[pair[0]];
                
                result.items.push({
                    id: pair[0],
                    desc: item.desc,
                    type: item.type,
                    count: pair[1]
                })
            });

        return result;
    }

}
