import buildings from "../data/buildings"
import constants from "../data/constants"

class EntityManager {

    constructor(ecs) {
        this.ecs = ecs;
    }

    /**
     * Get game entity
     */
    getGame() {
        return this.ecs.get(this.ecs.searchEntities("game")[0], "game")
    }

    /**
     * Transfer item between components
     * @param {object} compFrom Component from 
     * @param {object} compTo Component to
     * @param {string} item Item to transfer
     * @param {number} count Number of items to transfer
     */
    static transferItem(compFrom, compTo, item, count) {
        if (!compFrom["items"]) {
            throw new Error(`No "items" property on ${compFrom}`)
        }
        if (!compFrom.items[item]) {
            throw new Error(`${compFrom.name} has no ${item}`)
        }
        if (!compTo["items"]) {
            throw new Error(`No "items" property on ${compTo}`)
        }
        if (count > compFrom.items[item]) {
            throw new Error(`Not enough ${item} in ${compFrom}`)
        }

        //Add item count to target
        if (!compTo.items[item]) {
            compTo.items[item] = 0
        }

        compTo.items[item] += count;

        //Remove item from origin
        compFrom.items[item] -= count;

        if (compFrom.items[item] === 0) {
            delete compFrom.items[item]
        }
    }


    /**
     * Transfer all items between components
     * @param {object} compFrom Component from 
     * @param {object} compTo Component to
     */
    static transferAllItems(compFrom, compTo) {
        if (!compFrom["items"]) {
            throw new Error(`No "items" property on ${compFrom}`)
        }
        if (!compTo["items"]) {
            throw new Error(`No "items" property on ${compTo}`)
        }

        for (let item in compFrom.items) {
            this.transferItem(compFrom, compTo, item, compFrom.items[item])
        }
    }

    /**
     * Create a new building
     * @param {string} buildingId Building id from data file
     * @param {boolean} withConstruction Use construction or not. Default yes
     * @param {number} planet Planet entity id
     * @returns {number} New building id
     */
    createBuildingFromData(buildingId, withConstruction = true, planet) {
        let buildingData = buildings[buildingId];

        const building = this.ecs.createFromAssemblage({
            components: buildingData.components,
            data: buildingData.data
        })

        if (!withConstruction) {
            this.ecs.remove(building, "construction")
        }

        if (planet !== undefined) {
            this.ecs.set(planet, building, "building", "planetId")
        }

        //TODO:Better handling state !! 
        //TODO:Remove check..
        if (!this.ecs.has(building, "producer")) {
            throw new Error('TODO/Remove:No producer ')
        }

        this.ecs.set("inactive", building, "producer", "state");

        return building
    }

    createProducer({
        type = "",
        desc = "",
        speed = 1,
        planetId = 0,
        produce = "",
        state = ""
    }) {
        return this.ecs.createFromAssemblage({
            components: ["building", "producer"],
            data: {
                building: {
                    type,
                    desc,
                    planetId
                },
                producer: {
                    speed,
                    produce,
                    state
                }
            }
        })
    }


    createSpaceship({
        desc = "spaceship",
        x = 0,
        y = 0,
        moveTo = 0,
        speed = 150,
        states = [],
        stateRepeat = false
    }) {
        let spaceshipId = this.ecs.createFromAssemblage({
            components: ["spaceship", "spaceshipState", "position", "velocity"],
            data: {
                spaceship: {
                    desc,
                    speed,
                    states,
                    stateRepeat
                },
                spaceshipState: {
                    moveTo
                },
                position: {
                    x,
                    y
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
     * Get game speed
     * @returns {number} Game speed
     */
    getGameSpeed() {

        return this.ecs.searchEntities("game")
            .map(id => this.ecs.get(id, "game", "speed"))
            .find(() => true)        

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
     * @returns {number} Planet id
     */
    getPlanet(desc) {
        return this.ecs
            .searchEntities("planet")
            .find(id => this.ecs.get(id, "planet", "desc") === desc);
    }    
}


export default EntityManager;