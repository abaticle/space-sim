import buildings from "../data/buildings";

export default class ConstructionSystem {
    
    constructor(ecs, actions) {
        this.ecs = ecs
        this.actions = actions
    }

    init() {
        
    }

    /**
     * Construct buildings
     * @param {number} dt 
     */
    constructBuildings(dt) {
        const buildings = this.ecs.searchEntities(["building", "construction"])

        buildings.forEach(buildingId => {
            const construction = this.ecs.get(buildingId, "construction")

            construction.workstep += dt

            if (construction.workstep > construction.time) {
                this.ecs.remove(buildingId, "construction");
            }
        })
    }

    update(dt){
        this.constructBuildings(dt);
    }
}