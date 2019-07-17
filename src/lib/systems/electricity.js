export default class ElectricitySystem {

    /**
     * 
     * @param {ECS} ecs 
     * @param {ActionsManager} actions 
     */
    constructor(ecs, actions) {
        this.ecs = ecs
        this.actions = actions
    }

    init() {

        //Update planets maxElectricity
        const batteries = this.ecs.searchEntities(["building", "electricityBattery"])
            
        batteries.forEach(id => {
            const {
                building,
                electricityBattery
            } = this.ecs.get(id)

            const planet = this.ecs.get(building.planetId, "planet")

            planet.maxElectricity += electricityBattery.capacity
        })

    }

    updateProducers(dt) {

        //Remove electricity on all planets
        /*const planets = this.ecs.searchEntities(["planet"])

        planets.forEach(id => {
            const {
                planet
            } = this.ecs.get(id)

            planet.electricity = 0
        })*/

        //Update current electricity
        const producers = this.ecs.searchEntities(["building", "electricityProducer"])

        producers.forEach(id => {
            const {
                electricityProducer,
                building
            } = this.ecs.get(id)
            
            const planet = this.ecs.get(building.planetId, "planet")

            planet.electricity += electricityProducer.speed * dt

            if (planet.electricity >= planet.maxElectricity) {
                planet.electricity = planet.maxElectricity
            }
        });
    }

    update(dt) {
        this.updateProducers(dt)
    }
}