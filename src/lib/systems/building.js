import items from "../data/items";
import _ from "lodash";

export default class BuildingSystem {

    /**
     * 
     * @param {ECS} ecs 
     */
    constructor(ecs, actions) {
        this.ecs = ecs;
        this.actions = actions;
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


    takeRecipe(planetId, buildingId, item) {
        let planet = this.ecs.get(planetId, "planet")
        let producer = this.ecs.get(buildingId, "producer")

        const itemToProduce = items[producer.produce]


        //Check if can produce 
        let check = true

        Object.keys(itemToProduce).forEach(key => {
            if (!planet.items[key]) {
                check = false;
            }

            else {
                if (planet.items[key] < itemToProduce[key]) {
                    check = false;
                }
            }
        })

        if (check) {
            Object.keys(itemToProduce).forEach(key => {
                this.removeItem(planet.items, key, itemToProduce[key])
                this.addItem(producer.items, key, itemToProduce[key])
            })
        }

        return check;

    }


    producerInactive() {

    }

    producerActive(building, producer) {

        let { planetItems } = this.ecs.get(building.planetId, "planet", "items");
        const { recipe } = items[producer.produce];

        //Check if can produce 
        let check = true

        for (const key in recipe) {
            if (!planetItems[key]) {
                check = false;
            }
            else {
                if (planetItems[key] < recipe[key]) {
                    check = false;
                }
            }
        }

        //And take from planet items
        if (check) {
            for (const key in recipe) {
                this.removeItem(planetItems, key, recipe[key])
                this.addItem(producer.items, key, recipe[key])
            }

            producer.state = "filled";
        }
    }

    producerFilled(building, producer) {
        let planet = this.ecs.get(building.planetId, "planet");
        let itemToProduce = items[producer.produce];
                
        producer.workstep += (producer.speed * dt);

        //Work done
        if (producer.workstep > itemToProduce.time) {

            this.addItem(planet.items, producer.produce, itemToProduce[key])


            producer.state = "active";
        }
    }




    updateProducers(dt) {
        let producers = this.ecs.searchEntities(["producer"]);


        producers.forEach(producerId => {
            let {building, producer } = this.ecs.get(producerId);


            switch(producer.state) {

                //Inactive: do nothing
                case "inactive":
                this.producerInactive();


                //Active: get items from planet
                case "active":
                this.producerActive(building, producer);
                break;


                //Filled: can work. If work done go back to active and transfer to planet items
                case "filled":
                this.producerFilled(building, producer);
                break;
            }
        })
    }


    update(dt, actions) {
        
        this.updateProducers(dt);

        /*
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
        });*/
    }
}