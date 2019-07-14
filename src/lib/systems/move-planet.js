import Tools from "../modules/tools";

export default class MovePlanetSystem {

    constructor(ecs, actions) {
        this.ecs = ecs;
        this.actions = actions;
        
        this.planets = [];
    }

    init() {

        //Randomize planet positions 
        let planets = this.ecs.searchEntities(["planet", "position"])

        planets.forEach(id => {
            this.movePlanet(id, Math.random() * 10000)

            if (this.ecs.get(id, "planet", "desc") === "Earth") {
                const ship = this.ecs.searchEntities("spaceshipState")[0];

                const position = this.ecs.get(ship, "position")

                position.x = this.ecs.get(id, "position", "x") + 1000
            }
        })
        
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

        if (typeof planet.parentId === "number") {

            //Get parent posititon
            const parentPos = this.ecs.get(planet.parentId, "position")

            //Rotation target
            const rotation = Tools.rotate(parentPos, position, planet.speed * dt)
            
            position.x = rotation.x
            position.y = rotation.y

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


    /**
     * Move all planets
     * @param {number} dt Time difference
     */
    movePlanets(dt) {

        let planets = this.ecs.searchEntities(["planet", "position"])

        planets.forEach(id => {
            this.movePlanet(id, dt)
        })
    }


    update(dt) {
        this.movePlanets(dt);
    }

}