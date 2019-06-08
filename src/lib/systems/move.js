import Tools from "../modules/tools";

export default class MoveSystem {

    constructor(ecs, actions) {
        this.ecs = ecs;
        this.actions = actions;
        
        this.planets = [];
    }

    init() {

    }

    /**
     * Move a planet 
     * @param {number} id Entity Id
     * @param {*} dt Time difference
     */
    movePlanet(id, dt) {
        const {
            position,
            planet
        } = this.ecs.get(id);

        //Save planet position
        const t = {...position};

        if (planet.parentId !== undefined) {

            //Rotate planet :
            let parentPos = this.ecs.get(planet.parentId, "position");

            let r = Tools.rotate(parentPos.x, parentPos.y, position.x, position.y, planet.speed * dt);

            position.x = r.x
            position.y = r.y

            //And move all childrens :            
            t.x = position.x - t.x
            t.y = position.y - t.y

            planet.childrenIds.forEach(childrenId => {
                let p = this.ecs.get(childrenId, "position");
                
                p.x += t.x
                p.y += t.y
            })

        }
    }

    update(dt, actions) {
        let planets = this.ecs.searchEntities(["planet", "position"]);

        planets.forEach(id => {
            this.movePlanet(id, dt);
        })

    }

}