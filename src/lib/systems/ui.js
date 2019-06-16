import { planet as planetStore } from "../../svelte/stores.js";
import { get } from 'svelte/store';
import items from "../data/items";

export default class UISystem {

    constructor(ecs, actions) {
        this.ecs = ecs;
        this.actions = actions;
    }

    init() {

    }


    displayPlanet(planetId) {
        
        const { planet, position } = this.ecs.get(planetId);

        let result = {
            id: planetId,
            x: position.x,
            y: position.y,
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
        const planetItems = this.ecs.get(planetId, "planet", "items");

        for (let itemId in planetItems) {
            result.items.push({
                id: itemId,
                desc: items[itemId].desc,
                type: items[itemId].type,
                count: planetItems[itemId]
            })
        }

        planetStore.set(result);
    }


    removePlanet() {        
        planet.set(undefined);
        this.actions.removeAction("removePlanet");
    }


    displayBuyBuilding() {

    }

    update(dt) {
        
        const actions = this.actions.getActions();

        actions.map(({ action, payload }, i) => {
            //eval("this." + action + "(" + JSON.stringify(payload) + ")")
            
            switch (action) {

                //Display right panel 
                case "displayPlanet":
                    this.displayPlanet(payload)                    
                    break;

                case "removePlanet":
                    this.removePlanet();
                    break;
                
                case "displayBuyBuilding":
                    this.displayBuyBuilding(payload)
                    break;

                case "removeBuyBuilding":
                    break;

                //Remove planet
                case "removePanel": 
                    planet.set(undefined);

                    this.actions.removeAction(i);
                    this.actions.removeAction("displayPlanet")
                    break;
            }
        })

    }


}
