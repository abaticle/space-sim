import {
    planet as planetStore,
    chooseBuilding as chooseBuildingStore,
    chooseProduction as chooseProductionStore,
    entityList as entityListStore,
    spaceship as spaceshipStore,
    speed as speeedStore,
    ecs as ecsStore
} from "../ui/stores"
import items from "../data/items"
import buildings from "../data/buildings"
import EntityManager from "../modules/entity-manager"

export default class UISystem {

    constructor(ecs, actions) {
        this.ecs = ecs
        this.actions = actions
        this.entityManager = new EntityManager(ecs)
    }

    init() {

    }


    increaseSpeed(payload) {
        const game = this.entityManager.getGame();

        game.speed += 1

        speeedStore.set(game.speed)

        this.actions.removeAction("increaseSpeed")
    }

    decreaseSpeed(payload) {
        const game = this.entityManager.getGame();

        if (game.speed <= 1) {
            game.speed /= 2
        } 
        else {
            game.speed -= 1
        }

        speeedStore.set(game.speed)
        
        this.actions.removeAction("decreaseSpeed")
    }

    /**
     * Display a planet in the right panel
     * @param {object} payload Action payload
     * @param {number} payload.planetId Planet to display
     */
    displayPlanet(payload) {

        const planetId = payload.planetId

        const {
            planet,
            position
        } = this.ecs.get(planetId)

        let result = {
            id: planetId, 
            x: position.x,
            y: position.y,
            desc: planet.desc,
            owned: planet.owned,
            constructions: [],
            buildings: [],
            items: []
        }

        //Planet buildings :
        this.ecs
            .searchEntities("building")
            .filter(id => this.ecs.get(id, "building", "planetId") === planetId)
            .forEach(buildingId => {
                const {
                    building,
                    producer,
                    construction
                } = this.ecs.get(buildingId)

                let map = {
                    id: buildingId,
                    desc: building.desc
                }

                if (construction) {
                    map = {
                        ...map,
                        workstep: construction.workstep,
                        time: construction.time
                    }

                    result.constructions.push(map)
                } 

                else {
                    const item = items[producer.produce]

                    map = {
                        ...map,
                        canProduce: producer.canProduce,
                        workstep: producer.workstep,
                        produce: producer.produce === "" ? "" : item.desc,
                        time: producer.produce === "" ? "" : item.time
                    }

                    result.buildings.push(map)
                }
                
            })


        //Planet items
        const planetItems = this.ecs.get(planetId, "planet", "items")

        //Get stats
        const planetItemsStats = this._getPlanetItemsStat(planetId, planetItems)

        

        for (let itemId in planetItems) {
            result.items.push({
                id: itemId,
                desc: items[itemId].desc,
                type: items[itemId].type,
                count: planetItems[itemId],
                stat: planetItemsStats[itemId] || 0
            })
        }

        planetStore.set(result)
    }

    /**
     * Get a planet items stats
     */
    _getPlanetItemsStat(planetId, planetItems) {

        const buildings = this.ecs.searchEntities(["building", "producer"])
            .map(entityId => this.ecs.get(entityId))
            .filter(({building}) => building.planetId === planetId)
            .filter(({producer}) => producer.state === "filled")

        const stats = {}
        const speed = this.entityManager.getGameSpeed()
        
        //FIXME:Fix bug for planet items stats on consumption
        //TODO:Glitch with ui when consumption/production is = 0


        buildings.forEach(({producer}) => {
            const item = items[producer.produce]

            let stat;


            //Production 
            stat = speed / item.time

            stats[producer.produce] = stats[producer.produce] === undefined ? 
                stat : 
                stats[producer.produce] += stat
            
            
            //Consumption
            for (let itemId in item.recipe) {

                stat = item.recipe[itemId] / (item.time / speed)

                stats[itemId] = stats[itemId] === undefined ?
                    stat :
                    stats[itemId] -= stat
            }
        })

        return stats;
    }

    /**
     * Remove right panel
     */
    removePanel() {
        
        planetStore.set(undefined)
        spaceshipStore.set(undefined)
        entityListStore.set(undefined)

        this.actions.removeAction("displaySpaceship")
        this.actions.removeAction("displayPlanet")
        this.actions.removeAction("removePanel")
    }

    /**
     * Remove choose production popup
     */
    removeChooseProduction() {
        chooseProductionStore.set({
            visible: false
        })

        this.actions.removeAction("displayChooseProduction")
        this.actions.removeAction("removeChooseProduction")
    }

    /**
     * Remove buy building popup
     */
    removeBuyBuilding() {
        chooseBuildingStore.set({
            visible: false
        })

        this.actions.removeAction("displayBuyBuilding")
        this.actions.removeAction("removeBuyBuilding")
    }

    /**
     * Display production list to choose
     * @param {object} payload Action payload
     * @param {number} payload.buildingId Current building entity Id
     */
    displayChooseProduction(payload) {

        const producer = this.ecs.get(payload.buildingId, "producer")

        chooseProductionStore.set({
            visible: true,
            buildingId: payload.buildingId,
            items: Object.values(producer.canProduce).map(id => {
                return {
                    ...items[id]
                }
            })
        })

    }

    /**
     * Display building list to buy
     * @param {object} payload Action payload
     * @param {number} payload.planetId Current planet entity Id
     */
    displayBuyBuilding(payload) {

        const planetItems = this.ecs.get(payload.planetId, "planet", "items")

        /**
         * Check if planet has enough materials to construc a building
         * @param {object} building Building from data file
         */
        const canConstruct = (building) => {
            const buildingPrice = building.data.construction.price

            for (let item in buildingPrice) {
                if (!planetItems[item]) {
                    return false
                } else {
                    if (planetItems[item] < buildingPrice[item]) {
                        return false
                    }
                }
            }
            return true
        }

        //Update store 
        chooseBuildingStore.set({
            visible: true,
            planetId: payload.planetId,
            buildings: Object.keys(buildings).map(id => {
                return {
                    ...buildings[id],
                    canConstruct: canConstruct(buildings[id])
                }
            })
        })
    }

    /**
     * Buy a new building
     * @param {object} payload Action payload
     * @param {number} payload.planetId Current planet entity Id 
     * @param {string} payload.buildingId Building id from data file
     */
    buyBuilding(payload) {

        const { planetId, buildingId } = payload

        const planet = this.ecs.get(planetId, "planet")

        //Create building
        const newBuilding = this.entityManager.createBuildingFromData(buildingId, true, planetId)

        //Move items to construction
        const construction = this.ecs.get(newBuilding, "construction")

        for (let item in construction.price) {
            EntityManager.transferItem(planet, construction, item, construction.price[item])
        }
       
        //Remove action & popup
        this.actions.removeAction("buyBuilding")        

        //TODO:Remove popup ?
        this.removeBuyBuilding()
    }

    /**
     * Selected planets/ships
     * @param {object} payload Action payload
     * @param {number[]} payload.entities Array of selected entities
     */
    selectedEntities(payload) {
        
        const { entities } = payload

        if (entities.length === 1) {

            switch(true) {
                case this.ecs.has(entities[0], "planet"):
                    this.actions.addAction("displayPlanet", {
                        planetId: entities[0]
                    })   
                    break

                    
                case this.ecs.has(entities[0], "spaceship"):
                    this.actions.addAction("displaySpaceship", {
                        spaceshipId: entities[0]
                    })   
                    break
    
            }
        }

        else {
            this.actions.addAction("displayEntities", {
                entities: entities
            })   
        }

        this.actions.removeAction("selectedEntities")
    }


    /**
     * Display entities
     * @param {object} payload Action payload
     * @param {number[]} payload.entities Entities to display
     */
    displayEntities(payload) {

        let {entities} = payload;

        entities = entities.map(entityId => {

            const {planet, spaceship} = this.ecs.get(entityId)

            const newMap = {
                entityId
            }

            if (planet) {
                newMap.type = "planet"
                newMap.desc = planet.desc
                newMap.owned = planet.owned
            }

            else if (spaceship) {
                newMap.type = "spaceship"
                newMap.desc = spaceship.desc
                newMap.owned = spaceship.owned
            }

            return newMap
        })
        
        entityListStore.set({
            entities
        })

        this.actions.removeAction("displayEntities")
    }


    /**
     * Display Spaceship
     * @param {object} payload Action payload
     * @param {number} payload.spaceshipId Spaceship to display
     */
    displaySpaceship(payload) {

        const { spaceship, spaceshipState } = this.ecs.get(payload.spaceshipId)

        spaceshipStore.set({
            spaceship: {...spaceship},
            //spaceshipState: {...spaceshipState},

            stateIndex: spaceship.stateIndex,

            items: Object
                .entries(spaceship.items)
                .map(([key, val]) => {
                    return {
                        desc: items[key].desc,
                        count: val
                    }
                }),

            orders: spaceship.states.map(s => {

                const {state, payload } = s

                const ret = { }

                switch(state) {
                    case "move":
                        ret.state = "Move to"
                        ret.desc = this.ecs.get(payload.moveTo, "planet", "desc")                        
                        break

                    case "take":
                        ret.state = "Take"
                        ret.desc = Object
                            .entries(payload.takeItems)
                            .map(([key, val]) => key + "(" + val + ")")
                            .join(" / ")
                        break

                    case "give":
                        ret.state = "Give"
                        ret.desc = Object
                            .entries(payload.giveItems)
                            .map(([key, val]) => key + "(" + val + ")")
                            .join(" / ")
                        break

                }

                return ret
            })
        })

        
        //this.actions.removeAction("displaySpaceship")
    }

    /**
     * Choose new building production :
     * - Move current items to planet
     * - Change production
     * @param {object} payload Action payload
     * @param {number} payload.buildingId Building entity id
     * @param {string} payload.produce Item to produce
     */
    chooseProduction(payload) {

        const { buildingId, produce } = payload
        
        const { building, producer } = this.ecs.get(buildingId)
        
        //Nothing to do if same production
        if (producer.produce !== produce) {

            //Move all items to planet 
            const planet = this.ecs.get(building.planetId, "planet")

            EntityManager.transferAllItems(producer, planet)

            //Update production
            producer.produce = produce
            producer.workstep = 0
            producer.state = produce === "" ? "inactive" : "active"
            
        }

        this.actions.removeAction("chooseProduction")

        this.removeChooseProduction()
    }
    
    update(dt) {

        const actions = this.actions.getActions()

        actions.map(({
            action,
            payload
        }) => {

            this[action](payload);

        })


        ecsStore.set(this.ecs)

    }


}