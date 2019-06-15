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

        const planet = this.ecs.get(planetId, "planet")
        const producer = this.ecs.get(buildingId, "producer")

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

        const planetItems = this.ecs.get(building.planetId, "planet", "items");
        const {recipe} = items[producer.produce];

        //Check if planet has enough material
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

    producerFilled(building, producer, dt) {

        const planet = this.ecs.get(building.planetId, "planet");
        const itemToProduce = items[producer.produce];
                
        producer.workstep += (producer.speed * dt);

        //Work done
        if (producer.workstep > itemToProduce.time) {

            this.addItem(planet.items, producer.produce, 1)

            producer.workstep = 0;
            producer.state = "active";
        }
    }




    updateProducers(dt) {
        let producers = this.ecs.searchEntities(["producer"]);


        producers.forEach(producerId => {
            let {building, producer } = this.ecs.get(producerId);


            switch(producer.state) {

                case "inactive":
                    this.producerInactive();

                case "active":
                    this.producerActive(building, producer);

                case "filled":
                    this.producerFilled(building, producer, dt);

            }   
        })
    }


    update(dt, actions) {
        this.updateProducers(dt);
    }
}