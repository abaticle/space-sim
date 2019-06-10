import { extractor, building } from "../components/building";

class EntityManager {

    constructor(ecs) {
        this.ecs = ecs;
    }

    /**
     * Create a factory
     * @param {string} option.type Building type
     * @param {{type:{string}, desc: {string}, speed: {number}, planetId:{number}, price: {object}}} param0 
     */
    createFactory({
        type = "factory",
        desc = "Factory",
        speed = 1,
        planetId = 0,
        price = {
            ironBar: 5
        },
        produce,
        time = 0
    }) {
        this.ecs.createFromAssemblage({
            components: ["factory", "building"],
            data: {
                building: {
                    type,
                    desc,
                    price,
                    planetId
                },
                factory: {
                    speed,
                    produce,
                    time
                }
            }
        })
    }


    /**
     * Create an extractor
     * @param {{type:{string}, desc: {string}, speed: {number}, planetId:{number}, price: {object}}} param0 
     */
    createExtractor({
        type = "extractor",
        desc = "Extractor",
        speed = 1,
        planetId = 0,
        price = {
            ironBar: 5
        },
        resource,
        time = 0
    }) {
        this.ecs.createFromAssemblage({
            components: ["extractor", "building"],
            data: {
                building: {
                    type,
                    desc,
                    price,
                    planetId
                },
                extractor: {
                    speed,
                    resource,
                    time
                }
            }
        })
    }


    /**
     * Create a new planet
     * @param {{desc: string, size: number, x: number, y: number, speed: number, owned: boolean}} options Planet options
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
        parentId = undefined
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
                    parentId
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
}


export default EntityManager;