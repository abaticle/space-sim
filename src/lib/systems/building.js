import items from "../data/items";
import _ from "lodash";

export default class BuildingSystem {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs) {
        this.ecs = ecs;
    }

    init() {
        
    }


    /**
     * Add an item to a component
     * @param {object} comp Where to add items
     * @param {string} item Item to add
     * @param {number} count Number of items
     */
    addItem(comp, item, count) {
        if (comp[item]) {
            comp[item] += count;
        }
        else {
            comp[item] = count;
        }
    }

    /**
     * Remove an item to a component
     * @param {object} comp Where to remove items
     * @param {string} item Item to remove
     * @param {number} count Number of items
     */
    removeItem(comp, item, count) {
        if (comp[item]) {
            comp[item] -= count;

            if (comp[item] <= 0) {
                delete comp[item];
            }
        }
    }

    /**
     * Check if item has enough material to produce a recipe
     * @param {object} recipe 
     * @param {object} items 
     */
    canProduce(recipe, items) {

        let check = true;

        _.forOwn(recipe, (value, key) => {
            if (!items[key]) {
                check = false;
            }

            else {
                if (items[key] < value) {
                    check = false;
                }
            }
        })        

        return check;
    }


    update(dt, time) {
        this.buildings = this.ecs.searchEntities(["building"]);

        _.each(this.buildings, (buildingId) => {

            let building = this.ecs.get(buildingId, "building");
            let planet = this.ecs.get(building.planetId, "planet");

            if (this.ecs.has(buildingId, "factory")) {
                let factory = this.ecs.get(buildingId, "factory");

                //Get items from planet 
                if (!factory.canWork && factory.produce) {
                    let {recipe} = items[factory.produce];

                    //Check if planet has enough material
                    factory.canWork = this.canProduce(recipe, planet.items); 
                    
                    if (factory.canWork) {

                        //And if ok transfer from planet to factory
                        _.forOwn(recipe, (value, key) => {
                            this.removeItem(planet.items, key, value);
                            this.addItem(factory.items, key, value);
                        });        
                        
                        //console.log("planet", planet.items);
                        //console.log("factory", factory.items);
                    }
                }

                //Work
                if (factory.canWork) {
                    factory.workstep += dt;
                }

                //Produce
                if (factory.workstep > items[factory.produce].time) {
                    factory.workstep = 0;
                    factory.canWork = false;

                    let {recipe} = items[factory.produce];

                    _.forOwn(recipe, (value, key) => {
                        this.removeItem(factory.items, key, value);
                    });                    

                    this.addItem(planet.items, factory.produce, 1);
                }
            }


            else if (this.ecs.has(buildingId, "extractor")) {
                let extractor = this.ecs.get(buildingId, "extractor");

                if (extractor.resource) {
                    let produce = items[extractor.resource];

                    extractor.workstep += dt;

                    if (extractor.workstep >= produce.time) {
                        extractor.workstep = 0;

                        this.addItem(planet.items, produce.produce, 1);

                        //console.log("planet extracted", planet.items)
                    }
                }
            }
        });
    }
}