import {
    displayPlanet,
    planet
} from "../../svelte/stores.js";
import { get } from 'svelte/store';
import items from "../data/items";

export default class UISystem {

    constructor(ecs, payload) {
        this.ecs = ecs;
        this.payload = payload;
    }

    init() {

    }

    getPlanet(planetId) {
        let result = {
            id: planetId,
            name: this.ecs.get(planetId, "planet", "name"),
            buildings: [],
            items: []
        };

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
                        produce: items[extractor.resource].desc,
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

    update(dt, payload) {

        if (get(displayPlanet) !== -1) {
            let planetId = get(displayPlanet);

            planet.set(this.getPlanet(planetId));
        }
        /*payload.events = payload.events.filter(e => {
            if (e.name === "DisplayPlanet") {
                
            }
        })*/
    }
}
