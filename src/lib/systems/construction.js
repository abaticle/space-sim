import buildings from "../data/buildings";

export default class ConstructionSystem {
    
    constructor(ecs, actions) {
        this.ecs = ecs
        this.actions = actions
    }

    init() {
        
    }

    update(dt){
        const entities = this.ecs.searchEntities("construction");

        entities.forEach(entity => {
            const construction = this.ecs.get(entity, "construction");

            const building = buildings[construction.building];

            construction.workstep += dt

            if (construction.workstep >= building.time) {
                this.ecs.remove(entity, "construct");
            }
        });
    }
}