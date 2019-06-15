import items from "../data/items";
import _ from "lodash";
import EntityManager from "../modules/entity-manager";

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


    producerInactive() {

    }

    producerActive(building, producer) {

        const planetItems = this.ecs.get(building.planetId, "planet", "items");
        const planet = this.ecs.get(building.planetId, "planet")
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
                EntityManager.transferItem(planet, producer, key, recipe[key])
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
            producer.items[producer.produce] = 1;

            EntityManager.transferItem(producer, planet, producer.produce, 1)

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


    update(dt) {
        this.updateProducers(dt);
    }
}