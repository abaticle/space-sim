import { extractor, building } from "../components/building";

class EntityManager {

    constructor(ecs) {
        this.ecs = ecs;
    }


    createProducer({
        type = "",
        desc = "",
        speed = 1,
        planetId = 0,
        price = {
            ironBar: 5
        },
        produce = "",
        state = ""
    }) {
        return this.ecs.createFromAssemblage({
            components: ["building", "producer"],
            data: {
                building: {
                    type,
                    desc,
                    planetId,
                    price
                },
                producer: {
                    speed,
                    produce,
                    state
                }
            }
        })
    }


    /**
     * Create a new planet
     * @param {{desc: string, size: number, x: number, y: number, speed: number, owned: boolean, resources: object}} options Planet options
     * @returns {number} Planet id
     */
    createPlanet({
        type = "planet",
        desc = "desc",
        size = 10,
        x = 0,
        y = 0,
        speed = 1,
        owned = false,
        parentId = undefined,
        items = {}
    }) {
        let planetId = this.ecs.createFromAssemblage({
            components: ["planet", "position"],
            data: {
                planet: {
                    type,
                    desc,
                    size,
                    speed,
                    owned,
                    parentId,
                    items
                },
                position: {
                    x,
                    y
                }
            }
        })

        return planetId;
    }

    createShip() {

    }


    /**
     * Update all planets childrens array
     */
    updatePlanetsChildrens() {
        let planets = this.ecs.searchEntities("planet").map(id => this.ecs.get(id, "planet"));

        planets.forEach(planet => {

            function getChildren(id) {
                let childrens = planets.filter(p => p.parentId === id);

                if (childrens.length === 0) {
                    return;
                } else {
                    childrens.forEach(p => {
                        planet.childrenIds.push(p._id)
                        getChildren(p._id)
                    })
                }
            }

            getChildren(planet._id);
        })
    }

    /**
     * find a planet from it's desc
     * @param {string} desc 
     */
    getPlanet(desc) {
        return this.ecs
            .searchEntities("planet")
            .find(id => this.ecs.get(id, "planet", "desc") === desc);
    }    
}


export default EntityManager;